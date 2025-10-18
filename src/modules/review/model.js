import { Schema, model } from "mongoose";
import {statusPlugin} from "../../plugins/statusPlugin";

const reviewSchema = new Schema(
  {
    text: {
      type: String,
      trim: true,
      required: true,
    },
    productId: {
      type: Schema.ObjectId,
      ref: "product",
      required: true,
    },
    userId: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
    rate: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(['find','findOne'],function (){
  this.populate('userId','name -_id')
})

reviewSchema.plugin(statusPlugin);

const Review = model("Review", reviewSchema);
export {Review}