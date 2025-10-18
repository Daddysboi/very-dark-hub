import { z } from 'zod';

const addSubCategoryValidation = z.object({
  name: z.string().min(2).trim(),
  category: z.string().length(24).regex(/^[a-fA-F0-9]+$/, 'Invalid ObjectId'),
});

const updateSubCategoryValidation = z.object({
  id: z.string().length(24).regex(/^[a-fA-F0-9]+$/, 'Invalid ObjectId'),
  name: z.string().min(2).trim(),
});

const deleteSubCategoryValidation = z.object({
  id: z.string().length(24).regex(/^[a-fA-F0-9]+$/, 'Invalid ObjectId'),
});

export {
  addSubCategoryValidation,
  updateSubCategoryValidation,
  deleteSubCategoryValidation,
};
