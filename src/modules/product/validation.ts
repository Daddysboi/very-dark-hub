import z from "zod";

const addProductValidation = z.object({
  title: z.string().min(3),
  imgCover: z.string(),
  images: z.array(z.string()).optional(), // Corrected from `z.optional()`
  description: z.string().max(100).min(10),
  price: z.number().min(0).default(0), // Missing dot before default
  priceAfterDiscount: z.number().min(0).default(0),
  quantity: z.number().min(0).default(0),
  sold: z.number().min(0).default(0),
  category: z.string().length(24).regex(/^[a-fA-F0-9]+$/), // .hex() isn't a Zod method
  subcategory: z.string().length(24).regex(/^[a-fA-F0-9]+$/),
  brand: z.string().length(24).regex(/^[a-fA-F0-9]+$/),
  ratingAvg: z.number().min(1).max(5).optional(), // Should be optional unless required
  ratingCount: z.number().min(0).optional(),
});

const getSpecificProductValidation = z.object({
  id: z.string().length(24).regex(/^[a-fA-F0-9]+$/),
});

const updateProductValidation = z.object({
  id: z.string().length(24).regex(/^[a-fA-F0-9]+$/),
  imgCover: z.string().optional(),
  images: z.array(z.string()).optional(),
  title: z.string().min(3).trim().optional(), // Fixed .trim position and made optional
  description: z.string().max(100).min(10).trim().optional(),
  price: z.number().min(0).default(0).optional(),
  priceAfterDiscount: z.number().min(0).default(0).optional(),
  quantity: z.number().min(0).default(0).optional(),
  sold: z.number().min(0).default(0).optional(),
  category: z.string().length(24).regex(/^[a-fA-F0-9]+$/).optional(),
  subcategory: z.string().length(24).regex(/^[a-fA-F0-9]+$/).optional(),
  brand: z.string().length(24).regex(/^[a-fA-F0-9]+$/).optional(),
  ratingAvg: z.number().min(1).max(5).optional(),
  ratingCount: z.number().min(0).optional(),
});

const deleteProductValidation = z.object({
  id: z.string().length(24).regex(/^[a-fA-F0-9]+$/),
});

export {
  addProductValidation,
  getSpecificProductValidation,
  updateProductValidation,
  deleteProductValidation,
};
