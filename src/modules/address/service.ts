import { Address } from "./model";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";

export const addAddressService = async (userId, addressData) => {
    const newAddress = new Address({
        user: userId,
        ...addressData
    });
    await newAddress.save();
    return newAddress;
};

export const removeAddressService = async (addressId) => {
    const removedAddress = await Address.findByIdAndDelete(addressId);
    if (!removedAddress) {
        throw new AppError(httpStatus.NOT_FOUND, "Address not found!");
    }
    return removedAddress;
};

export const getAllAddressesService = async (userId) => {
    const addresses = await Address.find({ user: userId });
    if (!addresses || addresses.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "No addresses found for this user!");
    }
    return addresses;
};
