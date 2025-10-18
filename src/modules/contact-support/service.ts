import { Request } from 'express';
import httpStatus from 'http-status';
import { htmlToText } from 'html-to-text';

import { emailService } from '../../service/email/templates/mail_templates';
import SupportRequest from './model';
import { ISupportRequest, SupportQuery, SupportRequestStatus, SupportRequestType } from './types';
import { buildQueryFilters, executePaginatedQuery } from '../../utils/paginatedQuery';
import { userService } from '../user/service';
import AppError from "../../utils/AppError";

/**
 * Creates a new support request and sends a notification email.
 * @param fullName
 * @param email - The user's email.
 * @param message - The support request message.
 * @param type
 */
const createSupportRequest = async ({
  fullName,
  email,
  message,
  type,
}: {
  fullName: string;
  email: string;
  message: string;
  type: SupportRequestType;
}) => {
  const supportRequest = new SupportRequest({
    fullName,
    email,
    message,
    type,
    status: SupportRequestStatus.PENDING,
  });

  await supportRequest.save();

  try {
    await emailService.sendSupportNotificationEmail({ clientEmail: email, message });
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to send support request: ${error.message}`);
    }
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send support request due to an unknown error.');
  }
};

/**
 * Retrieves a list of support requests with optional pagination and filtering by creation date.
 * @param req - The request object containing query parameters.
 * @returns The list of support requests and total count.
 */
async function getSupportRequestsService(req: Request): Promise<{ results: ISupportRequest[]; total: number }> {
  const { page, limit, createdAt, status, type, keyword } = req.query as SupportQuery;
  const query = buildQueryFilters(createdAt, undefined, undefined, keyword, ['fullName', 'email']);

  if (createdAt) {
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid date format for createdAt');
    }
    query.createdAt = { $gte: date };
  }

  if (status) {
    if (!Object.values(SupportRequestStatus).includes(status as SupportRequestStatus)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid status');
    }
    query.status = status;
  }

  if (type) {
    if (!Object.values(SupportRequestType).includes(type as SupportRequestType)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid request type');
    }
    query.type = type;
  }

  const { results, total } = await executePaginatedQuery<ISupportRequest>(SupportRequest, query, Number(page), Number(limit), {
    populate: {
      path: 'resolvedBy',
      select: 'firstName lastName',
    },
  });
  return { results: results, total };
}

/**
 * Updates the status and/or type of specific support request.
 * @param id - The ID of the support request to update.
 * @param updates - The new status and/or type to set.
 * @returns The updated support request.
 */
const updateSupportRequest = async (
  id: string,
  updates: {
    status?: SupportRequestStatus;
    type?: SupportRequestType;
  },
) => {
  const updatedRequest = await SupportRequest.findByIdAndUpdate(id, updates, { new: true });

  if (!updatedRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Support request not found');
  }

  return updatedRequest;
};

/**
 * Deletes support request.
 * @returns The deleted support request.
 * @param ids
 */
const deleteSupportRequests = async (ids: string[]) => {
  const deletedRequests = await SupportRequest.deleteMany({
    _id: { $in: ids },
  });

  if (deletedRequests.deletedCount === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No support requests found for the provided IDs');
  }

  return;
};

const markAsRead = async (ids: string[]) => {
  const updateResult = await SupportRequest.updateMany({ _id: { $in: ids } }, { $set: { status: SupportRequestStatus.READ } });

  if (updateResult.modifiedCount === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No support requests found for the provided IDs');
  }

  return await SupportRequest.find({ _id: { $in: ids } });
};

const replyToSupportRequest = async (id: string, userId: string, message: string) => {
  const supportRequest = await SupportRequest.findById(id);
  if (!supportRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Support request not found');
  }

  const resolvedBy = await userService.getUserById(userId);
  if (!resolvedBy) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  try {
    await emailService.sendSupportReplyEmail(supportRequest.fullName, supportRequest.email, supportRequest.type, message);
  } catch (emailError) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send email');
  }

  supportRequest.status = SupportRequestStatus.RESOLVED;
  supportRequest.resolvedBy = resolvedBy;
  supportRequest.reply = htmlToText(message);
  await supportRequest.save();
  return supportRequest;
};

export const contactSupportService = {
  createSupportRequest,
  getSupportRequestsService,
  updateSupportRequest,
  deleteSupportRequests,
  markAsRead,
  replyToSupportRequest,
};
