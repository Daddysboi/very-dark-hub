import express from 'express';

import { otpController } from './controller';
import validate from '../../validators/validate';
import { OtpSchema } from './validation';
import * as authController from '../auth/controller';
import { commonValidation } from '../../validators/commonValidation';

const otpRouter = express.Router();

otpRouter.post('/validate-otp', validate({ body: OtpSchema }), otpController.validateOtp, authController.login);
otpRouter.post('/resend', validate({ body: commonValidation.EmailSchema }), otpController.terminateOldAndRequestNewOtp);
otpRouter.post('/request-otp', validate({ body: commonValidation.EmailSchema }), otpController.requestOtpByEmail);

export default otpRouter;
