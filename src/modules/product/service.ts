import slugify from "slugify";
import { Product } from "./model.ts";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import AppError from "../../utils/AppError.ts";

export const addProductService = async (data, files) => {
  data.imgCover = files.imgCover[0].filename;
  data.images = files.images.map((ele) => ele.filename);
  data.slug = slugify(data.title);
  const newProduct = new Product(data);
  await newProduct.save();
  return newProduct;
};

export const getAllProductsService = async (queryParams) => {
  let apiFeature = new ApiFeatures(Product.find(), queryParams)
    .pagination()
    .fields()
    .filtration()
    .search()
    .sort();
  return await apiFeature.mongooseQuery;
};

export const getSpecificProductService = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("Model was not found", 404);
  }
  return product;
};

export const updateProductService = async (id, data) => {
  if (data.title) {
    data.slug = slugify(data.title);
  }
  const updatedProduct = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedProduct) {
    throw new AppError("Model was not found", 404);
  }
  return updatedProduct;
};