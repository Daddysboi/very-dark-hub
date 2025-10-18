import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { contactSupportService } from './service';
import { UserRequest } from '../../validators/validateAccessControl';
import catchAsyncError from "../../utils/catchAsyncError";
import AppError from "../../utils/AppError";

/**
 * Creates a new support request.
 * @param req - The incoming request object.
 * @param res - The response object.
 */
const contactSupport = catchAsyncError(async (req: Request, res: Response) => {
  const { fullName, email, message, type } = req.body;
  await contactSupportService.createSupportRequest({ fullName, email, message, type });
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Your request has been successfully sent to the support team.',
  });
});

/**
 * Retrieves support requests with optional pagination.
 * @param req - The incoming request object.
 * @param res - The response object.
 */
const getSupportRequests = catchAsyncError(async (req: Request, res: Response) => {
  const { results, total } = await contactSupportService.getSupportRequestsService(req);
  res.status(httpStatus.OK).json({
    success: true,
    data: results,
    total,
  });
});

/**
 * Updates the status and/or type of support request.
 * @param req - The incoming request object.
 * @param res - The response object.
 */
const updateSupportRequest = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, type } = req.body;
  const updatedRequest = await contactSupportService.updateSupportRequest(id, { status, type });
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Support request updated successfully',
    data: updatedRequest,
  });
});

/**
 * Deletes a support request.
 * @param req - The incoming request object.
 * @param res - The response object.
 */
const deleteSupportRequests = catchAsyncError(async (req: Request, res: Response) => {
  const { ids } = req.body;
  await contactSupportService.deleteSupportRequests(ids);
  res.status(httpStatus.NO_CONTENT).json({
    success: true,
    message: 'Support request deleted successfully',
  });
});

/**
 * Marks multiple support requests as read.
 * @param req - The incoming request object.
 * @param res - The response object.
 */
const markAsRead = catchAsyncError(async (req: Request, res: Response) => {
  const { ids } = req.body;
  const updatedRequests = await contactSupportService.markAsRead(ids);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Support requests marked as read successfully',
    updatedRequests,
  });
});

const replyToSupportRequest = catchAsyncError(async (req: UserRequest, res: Response) => {
  const { id } = req.params;
  const { message } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const updatedRequest = await contactSupportService.replyToSupportRequest(id, userId, message);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Reply sent and support request marked as resolved',
    data: updatedRequest,
  });
});

export const contactSupportController = {
  contactSupport,
  getSupportRequests,
  updateSupportRequest,
  deleteSupportRequests,
  markAsRead,
  replyToSupportRequest,
};
