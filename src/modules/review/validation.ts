import {z} from "zod";

const addReviewValidation = z.object({
    text: z.string().trim(),
    productId: z.string(),
    rate: z.string(),
});

const getSpecificReviewValidation = z.object({
    id: z.string()
});

const updateReviewValidation = z.object({
    id: z.string(),
    text: z.string().trim(),
    rate: z.number(),
});

const deleteReviewValidation = z.object({
    id: z.string()
});

export {
    addReviewValidation,
    getSpecificReviewValidation,
    updateReviewValidation,
    deleteReviewValidation,
};
