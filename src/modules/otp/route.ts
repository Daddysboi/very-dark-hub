import express from 'express';

import {otpController} from './controller';
import validate from '../../validators/validate';
import {OtpSchema} from './validation';
import {commonValidation} from '../../validators/commonValidation';
import {authController} from "../auth/controller";

const otpRouter = express.Router();

otpRouter.post('/validate-otp', validate({body: OtpSchema}), otpController.validateOtp, authController.login);
otpRouter.post('/resend', validate({body: commonValidation.EmailSchema}), otpController.terminateOldAndRequestNewOtp);
otpRouter.post('/request-otp', validate({body: commonValidation.EmailSchema}), otpController.requestOtpByEmail);

export default otpRouter;
