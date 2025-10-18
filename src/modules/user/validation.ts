import {z} from "zod";

const createUserValidation = z.object({
  name: z.string().trim(),
  email: z.string().trim(),
  password: z.string(),
});

const updateUserValidation = z.object({
  name: z.string().trim(),
  password: z.string(),
  id: z.string().length(24),
});

const changeUserPasswordValidation = z.object({
  password: z.string(),
  id: z.string().length(24),
});

const deleteUserValidation = z.object({
  id: z.string().length(24),
});

export {
  createUserValidation,
  updateUserValidation,
  changeUserPasswordValidation,
  deleteUserValidation,
};
