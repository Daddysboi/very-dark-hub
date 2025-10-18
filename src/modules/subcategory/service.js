import slugify from "slugify";
import { Subcategory } from "./model";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import AppError from "../../utils/AppError.ts";

export const addSubCategoryService = async (data) => {
  data.slug = slugify(data.name);
  const newSubCategory = new Subcategory(data);
  await newSubCategory.save();
  return newSubCategory;
};

export const getAllSubCategoriesService = async (queryParams, categoryId) => {
  let filterObj = {};
  if (categoryId) {
    filterObj = { category: categoryId };
  }
  const apiFeature = new ApiFeatures(
      Subcategory.find(filterObj),
    queryParams
  ).filtration();
  return await apiFeature.mongooseQuery;
};

export const updateSubCategoryService = async (id, data) => {
  if (data.name) {
    data.slug = slugify(data.name);
  }
  const updatedSubCategory = await Subcategory.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
    }
  );
  if (!updatedSubCategory) {
    throw new AppError("Subcategory was not found", 404);
  }
  return updatedSubCategory;
};