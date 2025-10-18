import express from "express";
import * as coupon from "./controller.js";
import validate from "../../validators/validate";
import {
    createCouponValidation,
    deleteCouponValidation,
    getSpecificCouponValidation,
    updateCouponValidation,
} from "./validation.js";

const couponRouter = express.Router();

couponRouter
    .route("/")
    .post(
        validate(createCouponValidation),
        coupon.createCoupon
    )
    .get(coupon.getAllCoupons);

couponRouter
    .route("/:id")
    .put(
        validate(updateCouponValidation),
        coupon.updateCoupon
    )
    .delete(
        validate(deleteCouponValidation),
        coupon.deleteCoupon
    )
    .get(validate(getSpecificCouponValidation), coupon.getSpecificCoupon);

export default couponRouter;
