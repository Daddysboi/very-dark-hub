import {Country} from "./model";
import {ICountry} from "./types";

export const createCountry = async (countryData: Partial<ICountry>) => {
    const newCountry = new Country(countryData);
    await newCountry.save();
    return newCountry;
};