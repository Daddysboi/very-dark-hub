import express from "express";
import {addAddressValidation, deleteAddressValidation} from "./validation";
import validate from "../../validators/validate";
import {addAddress, getAllAddresses, removeAddress} from "./controller";


const addressRouter = express.Router();

addressRouter
    .route("/")
    .patch(
        validate({body: addAddressValidation}),
        addAddress
    )
    .delete(
        validate({body: deleteAddressValidation}),
        removeAddress
    )
    .get(getAllAddresses);

export default addressRouter;
