import {Schema, model} from "mongoose";
import {IAddress} from "./types";


const addressSchema = new Schema<IAddress>(
    {
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        street: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        postalCode: {type: String, required: true},
        country: {type: String, required: true},
        isDefault: {type: Boolean, default: false},
    },
    {timestamps: true}
);

const Address = model<IAddress>('Address', addressSchema);
export {Address}
