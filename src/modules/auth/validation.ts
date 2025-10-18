import {z} from 'zod';

import {passwordValidator} from '../../validators/passwordValidator';

const AuthenticateUserSchema = z.object({
    email: z.string().email().trim().min(1),
    password: z.string(),
    isCheckedRemember: z.boolean(),
});

const forgotPasswordSchema = z.object({
    email: z.string().min(1).trim().email(),
});

const PasswordResetSchema = z.object({
    password: z.string().min(8, {message: 'Password must be at least 8 characters long.'}).refine(passwordValidator, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number.',
    }),
});

const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(8, {message: 'Password must be at least 8 characters long.'}).refine(passwordValidator, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number.',
    }),
    newPassword: z.string().min(8, {message: 'Password must be at least 8 characters long.'}).refine(passwordValidator, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number.',
    }),
});

export const validation = {
    AuthenticateUserSchema,
    ChangePasswordSchema,
    PasswordResetSchema,
    forgotPasswordSchema,
};
