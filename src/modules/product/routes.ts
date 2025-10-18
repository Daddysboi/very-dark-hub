import express from "express";
import validate from "../../validators/validate";
import {getSpecificProductValidation} from "./validation";
import * as productController from "./controller";

const productRouter = express.Router();

// let arrFields = [
//     {name: "imgCover", maxCount: 1},
//     {name: "images", maxCount: 20},
// ];

productRouter
    .route("/")
    .post(
        // upload(arrFields, "products"),
        // validate(addProductValidation),
        productController.addProduct
    )
    .get(productController.getAllProducts);

productRouter
    .route("/:id")
    .put(
        // validate(updateProductValidation),
        productController.updateProduct
    )
    .delete(
        // validate(deleteProductValidation),
        productController.deleteProduct
    )
    .get(validate({ params: getSpecificProductValidation }), productController.getSpecificProduct);

export default productRouter;
