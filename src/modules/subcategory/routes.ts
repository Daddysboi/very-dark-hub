import express from "express";
import * as subCategory from "./controller.js";
import validate from "./../../validators/validate";
import {
    addSubCategoryValidation,
    deleteSubCategoryValidation,
    updateSubCategoryValidation,
} from "./validation.js";

const subCategoryRouter = express.Router({mergeParams: true});

subCategoryRouter
    .route("/")
    .post(
        validate(addSubCategoryValidation),
        subCategory.addSubCategory
    )
    .get(subCategory.getAllSubCategories);

subCategoryRouter
    .route("/:id")
    .put(
        validate(updateSubCategoryValidation),
        subCategory.updateSubCategory
    )
    .delete(
        validate(deleteSubCategoryValidation),
        subCategory.deleteSubCategory
    );

export default subCategoryRouter;
