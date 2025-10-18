import {Schema, model} from "mongoose";
import {IUser} from "./types";
import {Roles} from "../../config/roles";
import {statusPlugin} from "../../plugins/statusPlugin";
import {EMAIL_VALIDATION_REGEX} from "../../utils/constants";

const userSchema: Schema<IUser> = new Schema(
    {
        firstName: {
            type: String,
            required: false,
            trim: true,
        },
        lastName: {
            type: String,
            required: false,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: Roles,
        },
        wishlist: [{type: Schema.ObjectId, ref: 'product'}],
        email: {
            type: String,
            required: true,
            unique: true,
            match: [EMAIL_VALIDATION_REGEX, 'Please enter a valid email address'],
        },
        lastSensitiveActionAt: {
            type: Date,
            required: false,
        },
        profilePicture: {
            type: String,
            default: '',
        },
        phoneNumber: {
            type: String,
            required: false,
            default: null,
        },
        dateOfBirth: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.plugin(statusPlugin);
const User = model<IUser>('User', userSchema);
export {User}