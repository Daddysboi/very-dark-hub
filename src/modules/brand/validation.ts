import {z} from "zod";

const addBrandValidation = z.object({
    name: z.string().trim(),
});

const updateBrandValidation = z.object({
    name: z.string(),
    id: z.string(),
});

const deleteBrandValidation = z.object({
    id: z.string().length(24),
});

export {addBrandValidation, updateBrandValidation, deleteBrandValidation};
