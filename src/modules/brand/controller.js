import { deleteOne } from "../../handlers/factor.js";
import * as brandService from "./service";
import catchAsyncError from "../../utils/catchAsyncError";
import {Brand} from "./brand";

const addBrand = catchAsyncError(async (req, res, next) => {
  const newBrand = await brandService.addBrandService(req.body);
  res.status(201).json({ message: "success", addBrand: newBrand });
});

const getAllBrands = catchAsyncError(async (req, res, next) => {
  const allBrands = await brandService.getAllBrandsService(req.query);
  const page = req.query.page || 1;
  res.status(200).json({ page, message: "success", getAllBrands: allBrands });
});

const updateBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updatedBrand = await brandService.updateBrandService(id, req.body);
  res.status(200).json({ message: "success", updateBrand: updatedBrand });
});

const deleteBrand = deleteOne(Brand, "brand");

export { addBrand, getAllBrands, updateBrand, deleteBrand };