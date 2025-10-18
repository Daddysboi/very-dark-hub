import {Schema, model} from "mongoose";
import {IState} from "./types";

const stateSchema = new Schema<IState>(
    {
        name: {type: String, required: true},
        code: {type: String, required: true},
        country: {type: Schema.Types.ObjectId, ref: 'Country', required: true},
    },
    {timestamps: true}
);

const State = model<IState>('State', stateSchema);
export {State}