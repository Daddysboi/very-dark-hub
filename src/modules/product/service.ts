import slugify from "slugify";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import AppError from "../../utils/AppError";
import {Product} from "./model"

export const addProductService = async (data: any, files: any) => {
  data.imgCover = files.imgCover[0].filename;
  data.images = files.images.map((ele: any) => ele.filename);
  data.slug = slugify(data.title);
  const newProduct = new Product(data);
  await newProduct.save();
  return newProduct;
};

export const getAllProductsService = async (queryParams: any) => {
  let apiFeature = new ApiFeatures(Product.find(), queryParams)
    .pagination()
    .fields()
    .filtration()
    .search()
    .sort();
  return await apiFeature.mongooseQuery;
};

export const getSpecificProductService = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(404, "Model was not found", );
  }
  return product;
};

export const updateProductService = async (id: string, data: any) => {
  if (data.title) {
    data.slug = slugify(data.title);
  }
  const updatedProduct = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedProduct) {
    throw new AppError(404, "Model was not found");
  }
  return updatedProduct;
};