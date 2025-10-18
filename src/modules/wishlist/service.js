import { userModel } from "../user/model.ts";
import { AppError } from "../../utils/AppError.ts";

export const addToWishListService = async (userId, productId) => {
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { $addToSet: { wishlist: productId } },
    {
      new: true,
    }
  );
  if (!updatedUser) {
    throw new AppError("User or WishList not found", 404);
  }
  return updatedUser.wishlist;
};

export const removeFromWishListService = async (userId, productId) => {
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { $pull: { wishlist: productId } },
    {
      new: true,
    }
  );
  if (!updatedUser) {
    throw new AppError("User or WishList not found", 404);
  }
  return updatedUser.wishlist;
};

export const getAllUserWishListService = async (userId) => {
  const user = await userModel.findOne({ _id: userId }).populate("wishlist");
  if (!user) {
    throw new AppError("User or WishList not found", 404);
  }
  return user.wishlist;
};