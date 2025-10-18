import { Cart } from "./model";
import { Product } from "../product/model.ts";
import { Coupon } from "../coupon/model.ts";
import AppError from "../../utils/AppError.ts";

function calcTotalPrice(cart) {
  let totalPrice = 0;
  cart.cartItem.forEach((element) => {
    totalPrice += element.quantity * element.price;
  });
  cart.totalPrice = totalPrice;
}

export const addProductToCartService = async (userId, productId, quantity = 1) => {
  let product = await Product.findById(productId).select("price");
  if (!product) {
    throw new AppError("Model was not found", 404);
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      cartItem: [{ productId, quantity, price: product.price }],
    });
  } else {
    let item = cart.cartItem.find((element) => {
      return element.productId.toString() === productId;
    });
    if (item) {
      item.quantity += quantity;
    } else {
      cart.cartItem.push({ productId, quantity, price: product.price });
    }
  }
  calcTotalPrice(cart);

  if (cart.discount) {
    cart.totalPriceAfterDiscount =
      cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
  }
  await cart.save();
  return cart;
};

export const removeProductFromCartService = async (userId, itemId) => {
  let cart = await Cart.findOneAndUpdate(
    { userId },
    { $pull: { cartItem: { _id: itemId } } },
    { new: true }
  );
  if (!cart) {
    throw new AppError("Cart or item was not found", 404);
  }
  calcTotalPrice(cart);
  if (cart.discount) {
    cart.totalPriceAfterDiscount =
      cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
  }
  await cart.save();
  return cart;
};

export const updateProductQuantityService = async (userId, productId, quantity) => {
  let product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Model was not found", 404);
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError("Cart was not found", 404);
  }

  let item = cart.cartItem.find((elm) => elm.productId.toString() === productId);
  if (item) {
    item.quantity = quantity;
  } else {
    throw new AppError("Item not found in cart", 404);
  }
  calcTotalPrice(cart);

  if (cart.discount) {
    cart.totalPriceAfterDiscount =
      cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
  }
  await cart.save();
  return cart;
};

export const applyCouponService = async (userId, couponCode) => {
  let coupon = await Coupon.findOne({
    code: couponCode,
    expires: { $gt: Date.now() },
  });
  if (!coupon) {
    throw new AppError("Invalid or expired coupon", 404);
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError("Cart was not found", 404);
  }

  cart.totalPriceAfterDiscount =
    cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
  cart.discount = coupon.discount;

  await cart.save();
  return cart;
};

export const getLoggedUserCartService = async (userId) => {
  let cartItems = await Cart.findOne({ userId }).populate('cartItem.productId');
  if (!cartItems) {
    throw new AppError("Cart was not found", 404);
  }
  return cartItems;
};