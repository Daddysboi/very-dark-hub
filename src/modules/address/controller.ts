import catchAsyncError from "../../utils/catchAsyncError";
import httpStatus from "http-status";
import * as addressService from "./service";

const addAddress = catchAsyncError(async (req, res) => {
    const newAddress = await addressService.addAddressService(req.user?._id, req.body);
    res.status(httpStatus.CREATED).json({message: "success", address: newAddress});
});

const removeAddress = catchAsyncError(async (req, res) => {
    const {id} = req.params;
    const removedAddress = await addressService.removeAddressService(id);
    res.status(httpStatus.OK).json({message: "success", removeAddress: removedAddress});
});

const getAllAddresses = catchAsyncError(async (req, res) => {
    const addresses = await addressService.getAllAddressesService(req.user._id);
    res.status(httpStatus.OK).json({message: "success", getAllAddresses: addresses});
});

export {addAddress, removeAddress, getAllAddresses};