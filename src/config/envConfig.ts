import dotenv from 'dotenv';
import path from 'path';
import {z} from 'zod';

dotenv.config({path: path.join(__dirname, '../../.env')});

const envVarsSchema = z.object({
    NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
    PORT: z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), z.number()).default(3000),

    JWT_SECRET: z.string().min(1, 'JWT secret key is required'),
    JWT_ACCESS_EXPIRATION_MINUTES: z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), z.number()).default(30),
    JWT_REFRESH_EXPIRATION_DAYS: z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), z.number()).default(30),

    COOKIE_EXPIRATION_HOURS: z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), z.number()).default(24),

    SMTP_SERVER: z.string().optional(),
    SMTP_PORT: z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), z.number()).optional(),
    SMTP_LOGIN: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    EMAIL_FROM: z.string().min(1, 'EMAIL_FROM is required'),

    RESEND_API_KEY: z.string().optional(),
    BREVO_API_KEY: z.string().optional(),

    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    SESSION_SECRET: z.string().min(1, 'Session secret is required'),
    SALT: z.string(),
    ENCRYPTION_KEY: z.string().min(64, 'ENCRYPTION_KEY must be 64 characters long').max(64, 'ENCRYPTION_KEY must be 64 characters long'),
    ENCRYPTION_ALGORITHM: z.string().default('aes-256-cbc'),

    CLIENT_ID: z.string().optional(),
    CLIENT_SECRET: z.string().optional(),
    CALLBACK_URL: z.string().optional(),

    DATE_FORMAT: z.string().default('YYYY-MM-DD HH:mm:ss:ms'),

    MONGODB_URL: z.string().optional(),

    EMAIL_SUBSCRIPTION_SECRET: z.string().optional(),
    AUTH_EMAIL: z.string(),
    AUTH0_SECRET: z.string(),
    AUTH0_BASE_URL: z.string(),
    AUTH0_CLIENT_ID: z.string().optional(),
    AUTH0_ISSUER_BASE_URL: z.string().optional(),

    CLIENT_URL: z.string().optional(),
    BASE_URL: z.string().optional(),
    SUPPORT_EMAIL: z.string(),

    STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),

});

const envVars = envVarsSchema.parse(process.env);

export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: 10,
    },
    cookie: {
        cookieExpirationHours: envVars.COOKIE_EXPIRATION_HOURS,
    },
    email: {
        smtp: {
            host: envVars.SMTP_SERVER,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_LOGIN,
                password: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
    },
    resend: {
        apiKey: process.env.RESEND_API_KEY,
    },
    brevo: {
        apiKey: process.env.BREVO_API_KEY,
    },

    cloudinary: {
        cloudName: envVars.CLOUDINARY_CLOUD_NAME,
        apiKey: envVars.CLOUDINARY_API_KEY,
        apiSecret: envVars.CLOUDINARY_API_SECRET,
    },
    session: {
        secret: envVars.SESSION_SECRET,
    },
    encryption: {
        salt: envVars.SALT || 10,
        key: envVars.ENCRYPTION_KEY,
        algorithm: envVars.ENCRYPTION_ALGORITHM,
    },
    oauth: {
        clientId: envVars.CLIENT_ID,
        clientSecret: envVars.CLIENT_SECRET,
        callbackUrl: envVars.CALLBACK_URL,
    },
    stripe: {
        publishableKey: envVars.STRIPE_PUBLISHABLE_KEY,
        secretKey: envVars.STRIPE_SECRET_KEY,
        webhookSecret: envVars.STRIPE_WEBHOOK_SECRET,
    },
    dateFormat: envVars.DATE_FORMAT,
    mongodbUrl: envVars.MONGODB_URL ?? '',
    other: {
        emailSubscriptionSecret: envVars.EMAIL_SUBSCRIPTION_SECRET,
        authEmail: envVars.AUTH_EMAIL,
        auth0: {
            secret: envVars.AUTH0_SECRET,
            baseUrl: envVars.AUTH0_BASE_URL,
            clientId: envVars.AUTH0_CLIENT_ID,
            issuerBaseUrl: envVars.AUTH0_ISSUER_BASE_URL,
        },
        supportEmail: envVars.SUPPORT_EMAIL,
        clientUrl: envVars.CLIENT_URL,
        baseUrl: envVars.BASE_URL,
    },
};
