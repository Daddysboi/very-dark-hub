import { generateOtp } from '../../utils/helpers';
import httpStatus from 'http-status';
import OTP from '../otp/model';
import { User } from '../user/model';
import {userService} from "../user/service";
import AppError from "../../utils/AppError";
import {emailService} from "../../service/email/templates/mail_templates";

const requestOtpByEmail = async (email: string) => {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  const existingOtp = await OTP.findOne({ user: user._id, isUsed: false });

  if (existingOtp && existingOtp.expirationTime > new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You already have a valid OTP. Please wait until it expires.');
  }

  const { otp, newTime } = await generateOtp();
  const otpDoc = new OTP({
    otp,
    user: user._id,
    expirationTime: newTime,
    isUsed: false,
  });

  await otpDoc.save();

  try {
    await emailService.sendOtpEmail({
      email,
      otp,
    });
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send OTP email.');
  }
};

const validateOtp = async (userId: string, otp: number) => {
  const otpDoc = await OTP.findOne({ user: userId, otp, isUsed: false });

  if (!otpDoc) {
    return { valid: false, message: 'Invalid OTP or OTP already used.' };
  }

  if (otpDoc.isUsed) {
    return { valid: false, message: 'OTP has already been used.' };
  }

  if (otpDoc.expirationTime < new Date()) {
    return { valid: false, message: 'OTP has expired.' };
  }

  otpDoc.isUsed = true;
  await otpDoc.save();

  return { valid: true, message: 'OTP is valid.' };
};

const terminateOldOtp = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  const otpDoc = await OTP.findOne({ user: user._id, isUsed: false }).lean();
  if (otpDoc) {
    await OTP.deleteOne({ _id: otpDoc._id });
  }
};

export const otpService = {
  requestOtpByEmail,
  validateOtp,
  terminateOldOtp,
};
