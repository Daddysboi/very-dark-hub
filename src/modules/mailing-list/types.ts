import { Document, Types } from 'mongoose';

export interface IMailingListSubscriber extends Document {
  _id: Types.ObjectId;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
