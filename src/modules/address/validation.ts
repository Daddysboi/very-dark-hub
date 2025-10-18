import {z} from "zod";

const addAddressValidation = z.object({
    city: z.string(),
    street: z.string(),
    phone: z.string()

});

const deleteAddressValidation = z.object({
    address: z.string().length(24),
});

export {addAddressValidation, deleteAddressValidation};
