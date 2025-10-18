import express from "express";
import * as brand from "./controller.js";
import validate from "../../validators/validate"
import {
    addBrandValidation,
    deleteBrandValidation,
    updateBrandValidation,
} from "./validation.js";

const brandRouter = express.Router();

brandRouter
    .route("/")
    .post(
        validate(addBrandValidation),
        brand.addBrand
    )
    .get(brand.getAllBrands);

brandRouter
    .route("/:id")
    .put(
        validate(updateBrandValidation),
        brand.updateBrand
    )
    .delete(
        validate(deleteBrandValidation),
        brand.deleteBrand
    );

export default brandRouter;
