import { deleteOne } from "../../handlers/factor.js";
import { Subcategory } from "./model";
import {addSubCategoryService, getAllSubCategoriesService, updateSubCategoryService} from "./service";
import catchAsyncError from "../../utils/catchAsyncError";

const addSubCategory = catchAsyncError(async (req, res, next) => {
  const newSubCategory = await addSubCategoryService(req.body);
  res.status(201).json({ message: "success", addSubCategory: newSubCategory });
});

const getAllSubCategories = catchAsyncError(async (req, res, next) => {
  const categoryId = req.params.category;
  const allSubCategories = await getAllSubCategoriesService(req.query, categoryId);
  res.status(200).json({ message: "success", getAllSubCategories: allSubCategories });
});

const updateSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updatedSubCategory = await updateSubCategoryService(id, req.body);
  res.status(200).json({ message: "success", updateSubCategory: updatedSubCategory });
});

const deleteSubCategory = deleteOne(Subcategory, "subcategory");

export {
  addSubCategory,
  getAllSubCategories,
  updateSubCategory,
  deleteSubCategory,
};