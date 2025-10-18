import {User} from "../user/model";
import AppError from "../../utils/AppError";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import {IUser} from "../user/types";
import {
    compareData,
    decryptData,
    encryptData,
    generateExpires,
    generateToken,
    generateTokensAndSetCookies,
    verifyToken
} from "./utils";
import {emailService} from "../../service/email/templates/mail_templates";
import {userService} from "../user/service";
import {MILLISECONDS_IN_A_SECOND, SECONDS_IN_A_MINUTE} from "../../utils/constants";
import envConfig from "../../config/envConfig";
import {GenerateAuthTokensArgs} from "./types";
import { Request, Response } from "express";

const signUpService = async (userData: Partial<IUser>): Promise<IUser> => {
    const existingUser = await User.findOne({email: userData.email});
    if (existingUser) {
        throw new AppError(httpStatus.CONFLICT, "Account already exist!");
    }

    const user = new User({
        ...userData,
        password: await encryptData(userData.password ?? ""),
    });
    await user.save();

    try {
        await emailService.welcomeEmail({
            email: user?.email,
            firstName: user?.firstName,
        });
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send welcome email.');
    }

    return user;
};

const signInService = async (email: string, password: string) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await decryptData(password, user.password))) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    if (!user.isVerified) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Please verify your account by clicking the link sent to your email.');
    }

    delete user.password;
    return user;
};

async function generateResetPasswordToken(req: Request) {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) return;

    const expiresMs = generateExpires(envConfig.jwt.resetPasswordExpirationMinutes / SECONDS_IN_A_MINUTE);
    const resetToken = generateToken({ id: user._id }, expiresMs);

    try {
        const resetLink = `${envConfig.other.clientUrl}/forgot-password?token=${resetToken}`;
        await emailService.sendPasswordResetEmail({ email, resetLink });
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send password reset email.');
    }

    return;
}

async function resetPassword(req: Request) {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Reset token is required');
    }

    const decoded = await verifyToken(token);
    if (!decoded?.id) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid token payload');

    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid reset token');
    }

    if (user.lastSensitiveActionAt && decoded.iat * MILLISECONDS_IN_A_SECOND < user.lastSensitiveActionAt.getTime()) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Token Expired');
    }

    const { password } = req.body;
    const { password: userPassword } = user;
    if (!userPassword) return;
    const isSamePassword = await compareData(password, userPassword);
    if (isSamePassword) {
        throw new AppError(httpStatus.BAD_REQUEST, 'New password must be different from current password');
    }

    user.password = await encryptData(password);
    user.lastSensitiveActionAt = new Date();
    await user.save();

    return {
        success: true,
        message: 'Password reset successfully',
        userId: user._id,
    };
}

async function generateAuthTokens(res: Response, { id, role, isCheckedRemember }: GenerateAuthTokensArgs) {
    return await generateTokensAndSetCookies(res, id, role, isCheckedRemember);
}

async function refreshAuthToken(res: Response, refreshToken: string): Promise<any> {
    let decoded;
    try {
        decoded = await verifyToken(refreshToken);
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired refresh token');
    }

    const { userId } = decoded;
    const user = await userService.getUserById(userId);
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    return await generateTokensAndSetCookies(res, userId, user.role);
}

const verifyPassword = async (email: string, oldPassword: string) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !user.password) return false;

    try {
        return await decryptData(oldPassword, user.password);
    } catch (error) {
        return false;
    }
};


const updatePassword = async (email: string, newPassword: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
};

const verify = async (token: string): Promise<void> => {
    if (!token) {
        throw new AppError(httpStatus.NOT_FOUND, 'Token not found or expired.');
    }

    let decoded;
    let user;

    try {
        decoded = await verifyToken(token);

        if (!decoded?.id) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token.');
        }

        user = await User.findById(decoded.id);

        if (!user) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid reset token.');
        }

        // if (user.lastSensitiveActionAt && decoded.iat * MILLISECONDS_IN_A_SECOND < user.lastSensitiveActionAt.getTime()) {
        //   throw new AppError(httpStatus.UNAUTHORIZED, 'Token expired. Please contact support to help reset your email.');
        // }
    } catch (error) {
        const isExpired = (error as any)?.errorCode === 'TOKEN_EXPIRED';

        if (isExpired) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Token expired. Please contact support to help reset your email.');
        }

        throw error;
    }

    user.isVerified = true;
    await user.save();
};

export const authService = {
    generateResetPasswordToken,
    generateAuthTokens,
    verifyPassword,
    updatePassword,
    resetPassword,
    refreshAuthToken,
    verify,
    signUpService,
    signInService
};