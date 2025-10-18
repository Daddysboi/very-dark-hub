import catchAsyncError from "../../utils/catchAsyncError";
import {addToWishListService, getAllUserWishListService, removeFromWishListService} from "./service";

const addToWishList = catchAsyncError(async (req, res, next) => {
  const { productId } = req.body;
  const wishlist = await addToWishListService(req.user._id, productId);
  res.status(201).json({ message: "success", addToWishList: wishlist });
});

const removeFromWishList = catchAsyncError(async (req, res, next) => {
  const { productId } = req.body;
  const wishlist = await removeFromWishListService(req.user._id, productId);
  res.status(201).json({ message: "success", removeFromWishList: wishlist });
});

const getAllUserWishList = catchAsyncError(async (req, res, next) => {
  const wishlist = await getAllUserWishListService(req.user._id);
  res.status(201).json({ message: "success", getAllUserWishList: wishlist });
});

export { addToWishList, removeFromWishList, getAllUserWishList };