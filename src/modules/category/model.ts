import { Schema, model } from "mongoose";
import {statusPlugin} from "../../plugins/statusPlugin";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [4, "Too Short"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    Image: {
      type: String,
    },
  },
  { timestamps: true }
);

categorySchema.post('init',function(doc){
  doc.Image = `${process.env.BASE_URL}category/${doc.Image}`
  console.log(doc);

})

categorySchema.plugin(statusPlugin);

const Category = model("Category", categorySchema);
export {Category};