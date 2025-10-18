import {Document, Types} from 'mongoose';

export interface IOtp extends Document {
    _id: Types.ObjectId;
    otp: number;
    email: string;
    expirationTime: Date;
    isUsed: boolean;
}
