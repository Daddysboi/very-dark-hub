import {Schema, model} from "mongoose";
import {ICountry} from "./types";
import { statusPlugin } from "../../plugins/statusPlugin";


const countrySchema = new Schema<ICountry>(
    {
        name: {type: String, required: true},
        alpha2: {type: String, required: true},
        alpha3: {type: String, required: true},
        supported: {type: Boolean, required: true},
    },
    {
        timestamps: true
    }
);

countrySchema.plugin(statusPlugin);

const Country = model<ICountry>('Country', countrySchema);
export {Country}
