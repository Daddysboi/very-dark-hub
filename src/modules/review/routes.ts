import express from "express";
import * as review from "./controller.js";
import validate from "../../validators/validate";
import {
  addReviewValidation,
  deleteReviewValidation,
  getSpecificReviewValidation,
  updateReviewValidation,
} from "./validation.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .post(
    validate(addReviewValidation),
    review.addReview
  )
  .get(review.getAllReviews);

reviewRouter
  .route("/:id")
  .put(
    validate(updateReviewValidation),
    review.updateReview
  )
  .get(validate(getSpecificReviewValidation), review.getSpecificReview)
  .delete(
    validate(deleteReviewValidation),
    review.deleteReview
  );

export default reviewRouter;
