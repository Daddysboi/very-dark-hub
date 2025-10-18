import {Schema, model} from "mongoose";
import {ILga} from "./types";

const lgaSchema = new Schema<ILga>(
    {
        name: {type: String, required: true},
        code: {type: String, required: true, unique: true},
        state: {type: Schema.Types.ObjectId, ref: 'State', required: true},
    },
    {timestamps: true}
);

const Lga = model<ILga>('Lga', lgaSchema);
export {Lga}