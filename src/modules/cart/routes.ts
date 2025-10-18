import express from "express";

import * as cart from "./controller.js"

const cartRouter = express.Router();

cartRouter
    .route("/")
    .post(
        cart.addProductToCart
    ).get(
    cart.getLoggedUserCart
)
cartRouter
    .route("/apply-coupon")
    .post(
        cart.applyCoupon
    )

cartRouter
    .route("/:id")
    .delete(
        cart.removeProductFromCart
    )
    .put(
        cart.updateProductQuantity
    );

export default cartRouter;
