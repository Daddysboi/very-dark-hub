import {Response, Request} from "express";
import httpStatus from "http-status";
import catchAsyncError from "../../utils/catchAsyncError";
import {authService} from "./service";
import {UserRequest} from "../../validators/validateAccessControl";
import {userService} from "../user/service";
import AppError from "../../utils/AppError";

const signUp = catchAsyncError(async (req, res) => {
    const user = await authService.signUpService(req.body);
    res.status(httpStatus.CREATED).json({message: "success", user});
});

const login = catchAsyncError(async (req: Request, res: Response) => {
    const user = await authService.signInService(req.body.email, req.body.password);
    const tokens = await authService.generateAuthTokens(res, {
        id: String(user._id),
        role: user.role,
        isCheckedRemember: req.body.isCheckedRemember,
    });

    if (!res.headersSent) {
        res.send({user, tokens});
    }
});

const authenticatedUser = catchAsyncError(async (req: UserRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
    const user = await userService.getUserById(userId);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    delete user.password;
    return res.status(httpStatus.OK).json({user});
});

const refreshToken = catchAsyncError(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) return res.status(httpStatus.BAD_REQUEST).send({message: 'Refresh token is required'});
    const tokens = await authService.refreshAuthToken(res, refreshToken);

    res.status(httpStatus.OK).send({
        message: 'Tokens refreshed successfully',
        tokens,
    });
});

const forgotPassword = catchAsyncError(async (req: Request, res: Response) => {
    await authService.generateResetPasswordToken(req);
    res.send({success: true});
});

const resetPassword = catchAsyncError(async (req: Request, res: Response) => {
    await authService.resetPassword(req);
    res.send({success: true});
});

const changePassword = catchAsyncError(async (req: UserRequest, res: Response) => {
    const {oldPassword, newPassword} = req.body;
    const id = req.user?.id;

    const user = await userService.getUserById(id);
    if (!user) return res.status(httpStatus.NOT_FOUND).send({message: 'User not found.'});

    const isOldPasswordValid = await authService.verifyPassword(user.email, oldPassword);
    if (!isOldPasswordValid) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect password');
    }

    await authService.updatePassword(user.email, newPassword);
    res.send({success: true, message: 'Password updated successfully.'});
});

const validateToken = catchAsyncError(async (req: { query: { token?: string } }, res: Response) => {
    const {token} = req.query;
    if (!token) return;

    await authService.verify(token);
    res.status(httpStatus.CREATED).send({
        message: 'Your account verification is successful, Please login.',
    });
});

export default {
    signUp,
    login,
    authenticatedUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    changePassword,
    validateToken,
};
