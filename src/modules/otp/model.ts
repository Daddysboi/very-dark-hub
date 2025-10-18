import mongoose, { Schema } from 'mongoose';
import { IOtp } from './types';

const otpSchema: Schema<IOtp> = new Schema(
  {
    otp: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    expirationTime: {
      type: Date,
      required: true,
      index: { expires: '0s' },
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
