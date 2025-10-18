import { Address } from "./model";
import httpStatus from "http-status";
import AppError from "../../utils/AppError";

export const addAddressService = async (userId: string, addressData: any) => {
    const newAddress = new Address({
        user: userId,
        ...addressData
    });
    await newAddress.save();
    return newAddress;
};

export const removeAddressService = async (addressId: string) => {
    const removedAddress = await Address.findByIdAndDelete(addressId);
    if (!removedAddress) {
        throw new AppError(httpStatus.NOT_FOUND, "Address not found!");
    }
    return removedAddress;
};

export const getAllAddressesService = async (userId: string) => {
    const addresses = await Address.find({ user: userId });
    if (!addresses || addresses.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "No addresses found for this user!");
    }
    return addresses;
};
