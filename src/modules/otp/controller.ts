import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';
import { otpService } from './service';
import { User } from '../user/model';
import { Roles } from '../../config/roles';

const requestOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    await otpService.requestOtpByEmail(email);

    if (!res.headersSent) {
      return res.status(httpStatus.OK).send({
        actionRequired: 'otp_validation',
        user: Roles.SUPER_ADMIN,
        message: 'OTP sent successfully.',
      });
    }
  } catch (error) {
    return next(error);
  }
};

const validateOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { otp, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send({ message: 'User not found.' });
    }

    const result = await otpService.validateOtp(user.id, otp);
    if (!result.valid) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: result.message });
    }

    // Only proceed if headers haven't been sent
    if (!res.headersSent) {
      return next();
    }
  } catch (error) {
    return next(error);
  }
};

const requestOtpByEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    await otpService.requestOtpByEmail(email);

    if (!res.headersSent) {
      return res.status(httpStatus.OK).send({
        actionRequired: 'otp_validation',
        user: Roles.SUPER_ADMIN,
        message: 'OTP sent successfully.',
      });
    }
  } catch (error) {
    return next(error);
  }
};

const terminateOldAndRequestNewOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    await otpService.terminateOldOtp(email);
    await otpService.requestOtpByEmail(email);

    if (!res.headersSent) {
      return res.status(httpStatus.OK).send({
        actionRequired: 'otp_validation',
        user: Roles.SUPER_ADMIN,
        message: 'OTP sent successfully.',
      });
    }
  } catch (error) {
    return next(error);
  }
};

export const otpController = {
  requestOtp,
  validateOtp,
  terminateOldAndRequestNewOtp,
  requestOtpByEmail,
};
