import slugify from "slugify";
import { Brand } from "./brand.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { AppError } from "../../utils/AppError.ts";

export const addBrandService = async (data) => {
  data.slug = slugify(data.name);
  const newBrand = new Brand(data);
  await newBrand.save();
  return newBrand;
};

export const getAllBrandsService = async (queryParams) => {
  let apiFeature = new ApiFeatures(Brand.find(), queryParams)
    .pagination()
    .fields()
    .filtration()
    .search()
    .sort();
  return await apiFeature.mongooseQuery;
};

export const updateBrandService = async (id, data) => {
  if (data.name) {
    data.slug = slugify(data.name);
  }
  const updatedBrand = await Brand.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedBrand) {
    throw new AppError("Brand was not found", 404);
  }
  return updatedBrand;
};