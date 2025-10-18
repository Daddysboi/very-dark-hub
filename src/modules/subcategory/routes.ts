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
        validate({body: addSubCategoryValidation}),
        subCategory.addSubCategory
    )
    .get(subCategory.getAllSubCategories);

subCategoryRouter
    .route("/:id")
    .put(
        validate({body: updateSubCategoryValidation}),
        subCategory.updateSubCategory
    )
    .delete(
        validate({params: deleteSubCategoryValidation}),
        subCategory.deleteSubCategory
    );

export default subCategoryRouter;
