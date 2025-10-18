import {IState} from "../state/types";
import {Types} from "mongoose";

export interface ILga {
    _id?: Types.ObjectId;
    name: string,
    code: string,
    state: Types.ObjectId | IState,
    createdAt?: Date;
    updatedAt?: Date;
}