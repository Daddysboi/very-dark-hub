import { z } from 'zod';

export const OtpSchema = z.object({
  email: z.string().email().trim().min(1),
  otp: z.string().optional(),
});
