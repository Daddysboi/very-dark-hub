import { Request, Response, NextFunction } from 'express';
import { Cart } from '../cart/model';
import { Product } from '../product/model';
import { Order } from './model';
import Stripe from 'stripe';
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import {User} from "../user/model";
import envConfig from "../../config/envConfig";
import catchAsyncError from "../../utils/catchAsyncError";

// Define a custom request type to include the user property
interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

let stripe: Stripe;
if (envConfig.stripe.secretKey) {
  stripe = new Stripe(envConfig.stripe.secretKey, {
    // @ts-ignore
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  });
}
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const createCashOrder = catchAsyncError(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const cart: any = await Cart.findById(req.params.id);
  if (!cart) {
    return next(new AppError( httpStatus.NOT_FOUND, 'Cart not found'));
  }

  const totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;

  const order = new Order({
    userId: req.user?._id,
    cartItem: cart.cartItem,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  await order.save();

  if (order) {
    const options = cart.cartItem.map((item: any) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));

    await Product.bulkWrite(options);
    await Cart.findByIdAndDelete(req.params.id);

    return res.status(201).json({ message: 'success', order });
  } else {
    return next(new AppError( httpStatus.INTERNAL_SERVER_ERROR, 'Error creating order'));
  }
});

const getSpecificOrder = catchAsyncError(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const order = await Order.findOne({ userId: req.user?._id }).populate('cartItems.productId');
  if (!order) {
    return next(new AppError(httpStatus.NOT_FOUND, 'No order found for this user'));
  }
  res.status(200).json({ message: 'success', order });
});

const getAllOrders = catchAsyncError(async (_req: AuthRequest, res: Response) => {
  const orders = await Order.find({}).populate('cartItems.productId');
  res.status(200).json({ message: 'success', orders });
});

const createCheckOutSession = catchAsyncError(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const cart: any = await Cart.findById(req.params.id);
  if (!cart) {
    return next(new AppError(httpStatus.NOT_FOUND, 'Cart was not found'));
  }

  const totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user?.name || 'Model',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://github.com/AbdeIkader',
    cancel_url: 'https://www.linkedin.com/in/abdelrahman-abdelkader-259781215/',
    customer_email: req.user?.email,
    client_reference_id: req.params.id,
    metadata: req.body.shippingAddress,
  });

  res.json({ message: 'success', session });
});

async function handleSuccessfulPayment(session: Stripe.Checkout.Session, res: Response) {
  const cart: any = await Cart.findById(session.client_reference_id);
  if (!cart) {
    console.error(`Webhook Error: Cart not found with ID: ${session.client_reference_id}`);
    return res.status(200).json({ message: 'Cart not found, but webhook acknowledged.' });
  }

  const user: any = await User.findOne({ email: session.customer_email });
  if (!user) {
    console.error(`Webhook Error: User not found with email: ${session.customer_email}`);
    return res.status(200).json({ message: 'Model not found, but webhook acknowledged.' });
  }

  const order = new Order({
    userId: user._id,
    cartItem: cart.cartItem,
    totalOrderPrice: session.amount_total ? session.amount_total / 100 : 0,
    shippingAddress: session.metadata?.shippingAddress,
    paymentMethod: 'card',
    isPaid: true,
    paidAt: Date.now(),
  });

  await order.save();

  if (order) {
    const options = cart.cartItem.map((item: any) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));

    await Product.bulkWrite(options);
    await Cart.findOneAndDelete({ userId: user._id });

    return res.status(201).json({ message: 'success', order });
  } else {
    console.error(`Webhook Error: Failed to save order for cart ID: ${session.client_reference_id}`);
    return res.status(500).json({ message: 'Failed to save order.' });
  }
}

const createOnlineOrder = catchAsyncError(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleSuccessfulPayment(session, res);
  } else {
    console.log(`Unhandled event type ${event.type}`);
    res.status(200).send(`Unhandled event type ${event.type}`);
  }
});

export { createCashOrder, getSpecificOrder, getAllOrders, createCheckOutSession, createOnlineOrder };
