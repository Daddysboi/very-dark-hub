import slugify from "slugify";
import { model } from "./model.ts";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { AppError } from "../../utils/AppError.ts";

export const addCategoryService = async (data, file) => {
  data.Image = file.filename;
  data.slug = slugify(data.name);
  const newCategory = new model(data);
  await newCategory.save();
  return newCategory;
};

export const getAllCategoriesService = async (queryParams) => {
  let apiFeature = new ApiFeatures(model.find(), queryParams)
    .pagination()
    .fields()
    .filtration()
    .search()
    .sort();
  return await apiFeature.mongooseQuery;
};

export const updateCategoryService = async (id, data) => {
  if (data.name) {
    data.slug = slugify(data.name);
  }
  const updatedCategory = await model.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedCategory) {
    throw new AppError("Category was not found", 404);
  }
  return updatedCategory;
};