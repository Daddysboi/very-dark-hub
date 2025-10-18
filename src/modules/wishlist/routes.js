import express from "express";
import {
    addToWishListValidation,
    deleteFromWishListValidation,
} from "./validation.js";
import * as wishlist from "./controller.js";
import validate from "../../validators/validate";

const wishListRouter = express.Router();

wishListRouter
    .route("/")
    .patch(
        validate(addToWishListValidation),
        wishlist.addToWishList
    )
    .delete(
        validate(deleteFromWishListValidation),
        wishlist.removeFromWishList
    )
    .get(wishlist.getAllUserWishList);

export default wishListRouter;
