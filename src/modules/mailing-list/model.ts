import mongoose, { Schema } from 'mongoose';

import { IMailingListSubscriber } from './types';
import { EMAIL_VALIDATION_REGEX } from '../../utils/constants';

const SubscriberSchema = new Schema<IMailingListSubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [EMAIL_VALIDATION_REGEX, 'Please enter a valid email address'],
      trim: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IMailingListSubscriber>('Subscriber', SubscriberSchema);
