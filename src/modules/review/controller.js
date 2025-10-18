import { deleteOne } from "../../handlers/factor.js";
import { Review } from "./model";
import catchAsyncError from "../../utils/catchAsyncError";
import {addReviewService, getAllReviewsService, getSpecificReviewService, updateReviewService} from "./service";

const addReview = catchAsyncError(async (req, res, next) => {
  const newReview = await addReviewService(req.user._id, req.body);
  res.status(201).json({ message: "success", addReview: newReview });
});

const getAllReviews = catchAsyncError(async (req, res, next) => {
  const allReviews = await getAllReviewsService(req.query);
  const page  = req.query.page || 1;
  res.status(200).json({ page, message: "success", getAllReviews: allReviews });
});

const getSpecificReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const review = await getSpecificReviewService(id);
  res.status(200).json({ message: "success", result: review });
});

const updateReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updatedReview = await updateReviewService(id, req.user._id, req.body);
  res.status(200).json({ message: "success", updateReview: updatedReview });
});

const deleteReview = deleteOne(Review, "Review");

export {
  addReview,
  getAllReviews,
  getSpecificReview,
  updateReview,
  deleteReview,
};