import {Types} from "mongoose";

export interface IAddress {
    user: Types.ObjectId,
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country: string,
    isDefault: boolean,
}