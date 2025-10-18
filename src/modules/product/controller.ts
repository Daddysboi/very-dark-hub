import { deleteOne } from "../../handlers/factor.js";
import { Product } from "./model";
import * as productService from "./service";
import catchAsyncError from "../../utils/catchAsyncError";

const addProduct = catchAsyncError(async (req, res) => {
  const newProduct = await productService.addProductService(req.body, req.files);
  res.status(201).json({ message: "success", addProduct: newProduct });
});

const getAllProducts = catchAsyncError(async (req, res) => {
  const allProducts = await productService.getAllProductsService(req.query);
  const page = parseInt(req.query.page as string) || 1;
  res.status(200).json({ page, message: "success", getAllProducts: allProducts });
});

const getSpecificProduct = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const product = await productService.getSpecificProductService(id);
  res.status(200).json({ message: "success", getSpecificProduct: product });
});

const updateProduct = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const updatedProduct = await productService.updateProductService(id, req.body);
  res.status(200).json({ message: "success", updateProduct: updatedProduct });
});

const deleteProduct = deleteOne(Product, "Model");

export {
  addProduct,
  getAllProducts,
  getSpecificProduct,
  updateProduct,
  deleteProduct,
};