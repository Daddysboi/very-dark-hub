import { Review } from "./model";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import AppError from "../../utils/AppError.ts";

export const addReviewService = async (userId, reviewData) => {
  reviewData.userId = userId;
  let isReviewed = await Review.findOne({
    userId: userId,
    productId: reviewData.productId,
  });
  if (isReviewed) {
    throw new AppError("You created a review before", 409);
  }
  const newReview = new Review(reviewData);
  await newReview.save();
  return newReview;
};

export const getAllReviewsService = async (queryParams) => {
  let apiFeature = new ApiFeatures(Review.find(), queryParams)
    .pagination()
    .fields()
    .filtration()
    .search()
    .sort();
  return await apiFeature.mongooseQuery;
};

export const getSpecificReviewService = async (id) => {
  let result = await Review.findById(id);
  if (!result) {
    throw new AppError("Review was not found", 404);
  }
  return result;
};

export const updateReviewService = async (id, userId, updateData) => {
  const updatedReview = await Review.findOneAndUpdate(
    { _id: id, userId: userId },
    updateData,
    {
      new: true,
    }
  );
  if (!updatedReview) {
    throw new AppError("Review was not found or you're not authorized to update this review", 404);
  }
  return updatedReview;
};