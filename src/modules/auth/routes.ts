import express from "express";
import validate from "../../validators/validate";
import {commonValidation} from "../../validators/commonValidation";
import {validation} from "./validation";
import {authenticateJWT} from "../../middlewares/jwt";
import authController from './controller';
import {grantAccess} from "../../validators/validateAccessControl";
import {Resources} from "../../config/roles";


const authRouter = express.Router();

authRouter.post("/signup", validate({body: commonValidation.EmailSchema}), authController.signUp);
authRouter.post("/signin", validate({body: validation.AuthenticateUserSchema}), authController.login);
authRouter.get('/me', authenticateJWT, authController.authenticatedUser)
authRouter.post('/refresh-token', authController.refreshToken)
authRouter.post('/forgot-password', validate({body: validation.forgotPasswordSchema}), authController.forgotPassword)
authRouter.patch(
    '/reset-password',
    validate({
        body: validation.PasswordResetSchema,
        query: commonValidation.tokenSchema,
    }),
    authController.resetPassword,
)
authRouter.post(
    '/change-password',
    authenticateJWT,
    grantAccess('update', 'own', Resources.USER),
    validate({body: validation.ChangePasswordSchema}),
    authController.changePassword,
);
authRouter.route('/validate-token').post(validate({query: commonValidation.tokenSchema}), authController.validateToken);

export default authRouter;
