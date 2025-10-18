import {Document, Types} from 'mongoose';

import {Roles} from '../../config/roles';
import {IAddress} from "../address/types";

export interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: Roles;
    wishlist: Types.ObjectId;
    profilePicture?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    lastSensitiveActionAt?: Date;
    address?: IAddress[];
}

export interface BaseQuery {
    page?: string;
    limit?: string;
    createdAt?: string;
    startDate?: string;
    endDate?: string;
    createdBefore?: string;
    keyword?: string;
    userType?: UserTypes;
}

export interface PriceRangeQuery extends DateRangeQuery {
    minPrice?: number;
    maxPrice?: number;
}

export interface DateRangeQuery extends BaseQuery {
    startDate?: string;
    endDate?: string;
}

export type UserTypes = 'instructor' | 'student' | 'admin';
