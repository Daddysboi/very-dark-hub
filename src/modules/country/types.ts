import { Types } from 'mongoose';
import { GenericStatusConstant } from '../../types/GenericStatusConstant';

export interface ICountry {
    _id?: Types.ObjectId;
    name: string,
    alpha2: string,
    supported: boolean,
    alpha3: string,
    status?: GenericStatusConstant;
    createdAt?: Date;
    updatedAt?: Date;
}