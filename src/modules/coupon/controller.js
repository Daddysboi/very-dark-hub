import { deleteOne } from "../../handlers/factor.js";
import * as couponService from "./service";
import catchAsyncError from "../../utils/catchAsyncError";
import {Coupon} from "./model";

const createCoupon = catchAsyncError(async (req, res, next) => {
  const newCoupon = await couponService.createCouponService(req.body);
  res.status(201).json({ message: "success", createCoupon: newCoupon });
});

const getAllCoupons = catchAsyncError(async (req, res, next) => {
  const page  = req.query.page || 1;
  const allCoupons = await couponService.getAllCouponsService(req.query);
  res.status(200).json({ page, message: "success", getAllCoupons: allCoupons });
});

const getSpecificCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { coupon, qrCodeUrl } = await couponService.getSpecificCouponService(id);
  res.status(200).json({ message: "success", getSpecificCoupon: coupon, url: qrCodeUrl });
});

const updateCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updatedCoupon = await couponService.updateCouponService(id, req.body);
  res.status(200).json({ message: "success", updateCoupon: updatedCoupon });
});

const deleteCoupon = deleteOne(Coupon, "Coupon");

export {
  createCoupon,
  getAllCoupons,
  getSpecificCoupon,
  updateCoupon,
  deleteCoupon,
};