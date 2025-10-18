import { Document, Types } from 'mongoose';

import { BaseQuery, IUser } from '../user/types';

export interface ISupportRequest extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  message: string;
  reply: string;
  status: SupportRequestStatus;
  type: SupportRequestType;
  createdAt: Date;
  updatedAt: Date;
  resolvedBy: IUser;
}

export enum SupportRequestStatus {
  PENDING = 'PENDING',
  READ = 'READ',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum SupportRequestType {
  REFUND = 'REFUND',
  ACCOUNT_ISSUE = 'ACCOUNT_ISSUE',
  TECHNICAL_SUPPORT = 'TECHNICAL_SUPPORT',
  BILLING = 'BILLING',
  GENERAL = 'GENERAL',
  OTHER = 'OTHER',
}

export interface SupportQuery extends BaseQuery {
  status?: string;
  read?: string;
  type?: string;
}
