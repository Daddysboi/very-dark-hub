import {Request} from "express";
import {User} from "./model";

import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import {IUser} from "./types.js";
import {verifyToken} from "../auth/utils";
import {Address} from "../address/model";
import {buildQueryFilters, executePaginatedQuery} from "../../utils/paginatedQuery";
import {Roles} from "../../config/roles";
import logger from "../../utils/logger";
import {emailService} from "../../service/email/templates/mail_templates";

const getUserByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({email}).lean();
};

const createUser = async (req: Request) => {
    const {user, address} = req.body;
    const {role} = req.user;

    if (!user?.email) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Email is required');
    }
    const existingUser = await getUserByEmail(user?.email);

    if (existingUser) {
        throw new AppError(httpStatus.CONFLICT, 'This email already exists');
    }

    if (!role) {
        throw new AppError(httpStatus.NOT_FOUND, 'Role not found');
    }

    if (role === Roles.SUPER_ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, 'Creating a SUPER ADMIN is restricted.');
    }

    const newUser = await User.create(user);
    await Address.create({
        ...address,
        user: newUser._id
    });

    try {
        await emailService.welcomeEmail({
            email: user?.email,
            firstName: user?.firstName ?? "",
        });
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send welcome email.');
    }

    return newUser;
};


export const getAllUsersService = async (queryParams: any): Promise<{ users: IUser[]; total: number }> => {
    const {page, limit, userType, createdAt, startDate, endDate, keyword} = queryParams;
    const query = buildQueryFilters(createdAt, startDate, endDate, keyword, ['firstName', 'lastName', 'email']);

    if (userType && userType === 'admin') {
        query.role = {$in: [Roles.ADMIN, Roles.SUPER_ADMIN]};
    }

    const {results, total} = await executePaginatedQuery<IUser>(User, query, Number(page), Number(limit));

    await Promise.all(
        results.map(async (user) => {
            try {
                // Fetch all addresses for this user
                const addresses = await Address.find({user: user._id})
                    .select('street city state country')
                    .lean();

                user.address = addresses || [];
                user.password = undefined;
            } catch (error) {
                logger.error(`Error fetching addresses for user ${user._id}:`, error);
                user.address = [];
            }
        })
    );
    return {users: results, total};
};

export const updateUserService = async (id: string, updateData: IUser) => {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
    });
    if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User was not found");
    }
    return updatedUser;
};

export const changeUserPasswordService = async (id: string, newPasswordData: any) => {
    newPasswordData.passwordChangedAt = Date.now();
    const updatedUser = await User.findByIdAndUpdate(id, newPasswordData, {
        new: true,
    });
    if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User was not found");
    }
    return updatedUser;
};

const getUserById = async (id: string): Promise<IUser | null> => {
    return User.findById(id).lean();
};

const deleteUserById = async (userId: string): Promise<IUser | null> => {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return deletedUser;
};

const updateUser = async (): Promise<IUser | null> => {
    return null
};

const verifyEmail = async (token: string): Promise<boolean> => {
    const decoded = await verifyToken(token);

    if (!decoded) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
    }

    const user = await getUserById(decoded.id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    await user.save();
    return true;
};

const sendVerificationEmail = async (_userId: string, _firstName: string, _email: string, _route: string, _numberOfDays = 1) => {
    // const verificationToken = generateToken({id: userId}, numberOfDays);
    // const verificationUrl = `${envConfig.other.clientUrl}/${route}?token=${verificationToken}`;

    try {
        // await emailService.sendVerificationEmail(firstName, email, verificationUrl);
    } catch (error) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send verification email.');
    }
    return;
};


export const userService = {
    getUserByEmail,
    getUserById,
    createUser,
    deleteUserById,
    updateUser,
    verifyEmail,
    sendVerificationEmail,
    getAllUsersService,
    updateUserService,
    changeUserPasswordService
};
