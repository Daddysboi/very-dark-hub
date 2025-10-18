import {State} from "./model";
import {IState} from "./types";
import {Country} from "../country/model";

export const createState = async (stateData: Partial<IState> & {countryAlpha3: string}) => {
    const country = await Country.findOne({ alpha3: stateData.countryAlpha3 });
    if (country) {
        const newState = new State({
            name: stateData.name,
            code: stateData.code,
            country: country._id,
        });
        await newState.save();
        return newState;
    }
    return null;
};