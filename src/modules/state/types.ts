import {ICountry} from "../country/types";
import {Types} from "mongoose";

export interface IState {
    _id?: Types.ObjectId;
    name: string,
    code: string,
    country: Types.ObjectId | ICountry,
    createdAt?: Date;
    updatedAt?: Date;
}