import { UserRequest } from './validateAccessControl';
import { NextFunction } from 'express';
import { Roles } from '../config/roles';
import AppError from '../utils/AppError';
import httpStatus from 'http-status';
import { decryptData } from '../modules/auth/utils';
import {otpController} from "../modules/otp/controller";
import {User} from "../modules/user/model";

export const requestOtpIfSuperAdmin = async (req: UserRequest, res: any, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne( { email });
    // const user = await userService.getUserByEmail(email);
    if (!user || !(await decryptData(password, user.password))) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    switch (user.role) {
      case Roles.SUPER_ADMIN:
        await otpController.requestOtp(req, res, next);
        break;
      case Roles.ADMIN:
        return next();
      default:
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode || 500).send({ message: error.message });
    }
    return res.status(500).send({ message: 'An unexpected error occurred' });
  }
};
