import z from 'zod';

import { SupportRequestStatus, SupportRequestType } from './types';

const ContactSupportSchema = z.object({
  fullName: z.string().min(3).max(100),
  email: z.string().email(),
  type: z.nativeEnum(SupportRequestType),
  message: z.string().min(5).max(500),
});

const StatusSchema = z.object({
  status: z.enum(Object.values(SupportRequestStatus) as [string, ...string[]]),
  type: z.enum(Object.values(SupportRequestType) as [string, ...string[]]),
});

const ReplySchema = z.object({
  message: z.string().min(5, 'Reply message must be at least 5 characters long').max(1000, 'Reply message is too long'),
});

export const contactSupportValidation = {
  ContactSupportSchema,
  StatusSchema,
  ReplySchema,
};
