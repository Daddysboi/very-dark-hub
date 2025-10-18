import { deleteOne } from "../../handlers/factor.js";
import {Category} from "./model";
import * as categoryService from "./service";
import catchAsyncError from "../../utils/catchAsyncError";

const addCategory = catchAsyncError(async (req, res, next) => {
  const newCategory = await categoryService.addCategoryService(req.body, req.file);
  res.status(201).json({ message: "success", addCategory: newCategory });
});

const getAllCategories = catchAsyncError(async (req, res, next) => {
  const allCategories = await categoryService.getAllCategoriesService(req.query);
  const page = req.query.page || 1;
  res.status(200).json({ page, message: "success", getAllCategories: allCategories });
});

const updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updatedCategory = await categoryService.updateCategoryService(id, req.body);
  res.status(200).json({ message: "success", updateCategory: updatedCategory });
});

const deleteCategory = deleteOne(Category, "category");

export { addCategory, getAllCategories, updateCategory, deleteCategory };