import { Coupon } from "./model";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import AppError from "../../utils/AppError.ts";
import QRCode from "qrcode";

export const createCouponService = async (data) => {
  const newCoupon = new Coupon(data);
  await newCoupon.save();
  return newCoupon;
};

export const getAllCouponsService = async (queryParams) => {
  let apiFeature = new ApiFeatures(Coupon.find(), queryParams)
    .pagination()
    .fields()
    .filtration()
    .search()
    .sort();
  return await apiFeature.mongooseQuery;
};

export const getSpecificCouponService = async (id) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new AppError("Coupon was not found", 404);
  }
  const qrCodeUrl = await QRCode.toDataURL(Coupon.code);
  return { coupon, qrCodeUrl };
};

export const updateCouponService = async (id, data) => {
  const updatedCoupon = await Coupon.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedCoupon) {
    throw new AppError("Coupon was not found", 404);
  }
  return updatedCoupon;
};