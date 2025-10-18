import mongoose, { Schema } from 'mongoose';

import { ISupportRequest, SupportRequestStatus, SupportRequestType } from './types';

const SupportRequestSchema = new Schema<ISupportRequest>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: SupportRequestType,
      default: SupportRequestType.GENERAL,
    },
    status: {
      type: String,
      default: SupportRequestStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

const SupportRequest = mongoose.model<ISupportRequest>('SupportRequest', SupportRequestSchema);
export default SupportRequest;
