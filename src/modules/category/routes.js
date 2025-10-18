import express from "express";
import * as category from "./controller.js";
import subCategoryRouter from "../subcategory/routes.ts";
import {
    addCategoryValidation,
    deleteCategoryValidation,
    updateCategoryValidation,
} from "./validation.js";
import validate from "../../validators/validate";
import {upload} from "../../config/multer";

const categoryRouter = express.Router();

categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

/*
categoryRouter
    .route("/")
    .post(
        upload("Image", "category"),
        validate(addCategoryValidation),
        category.addCategory
    )
    .get(category.getAllCategories);

categoryRouter
    .route("/:id")
    .put(
        validate(updateCategoryValidation),
        category.updateCategory
    )
    .delete(
        validate(deleteCategoryValidation),
        category.deleteCategory
    );

 */
export default categoryRouter;
