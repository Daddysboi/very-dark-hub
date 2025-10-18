import * as cartService from "./service";
import catchAsyncError from "../../utils/catchAsyncError";

const addProductToCart = catchAsyncError(async (req, res, next) => {
  const cart = await cartService.addProductToCartService(req.user._id, req.body.productId, req.body.quantity);
  res.status(201).json({ message: "success", result: cart });
});

const removeProductFromCart = catchAsyncError(async (req, res, next) => {
  const cart = await cartService.removeProductFromCartService(req.user._id, req.params.id);
  res.status(200).json({ message: "success", cart });
});

const updateProductQuantity = catchAsyncError(async (req, res, next) => {
  const cart = await cartService.updateProductQuantityService(req.user._id, req.params.id, req.body.quantity);
  res.status(201).json({ message: "success", cart });
});

const applyCoupon = catchAsyncError(async (req, res, next) => {
  const cart = await cartService.applyCouponService(req.user._id, req.body.code);
  res.status(201).json({ message: "success", cart });
});

const getLoggedUserCart = catchAsyncError(async (req, res, next) => {
  const cart = await cartService.getLoggedUserCartService(req.user._id);
  res.status(200).json({ message: "success", cart });
});

export {
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  applyCoupon,
  getLoggedUserCart
};