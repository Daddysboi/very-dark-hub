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
        validate({body: addReviewValidation}),
        review.addReview
    )
    .get(review.getAllReviews);

reviewRouter
    .route("/:id")
    .put(
        validate({body: updateReviewValidation}),
        review.updateReview
    )
    .get(validate({params: getSpecificReviewValidation}), review.getSpecificReview)
    .delete(
        validate({params: deleteReviewValidation}),
        review.deleteReview
    );

export default reviewRouter;
