import { Schema, model } from "mongoose";
import {statusPlugin} from "../../plugins/statusPlugin";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [2, "Too Short"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: Schema.ObjectId,
      required: true,
      ref: "category",
    },
  },
  { timestamps: true }
);

subCategorySchema.plugin(statusPlugin);
const Subcategory = model("Subcategory", subCategorySchema);
export {Subcategory};
