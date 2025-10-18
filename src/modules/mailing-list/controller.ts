import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { mailingListService } from './service';
import catchAsyncError from '../../utils/catchAsyncError';
import { BaseQuery } from '../user/types';
import AppError from "../../utils/AppError";

/**
 * Subscribe a user to the mailing list.
 * @param req - The incoming request object.
 * @param res - The response object.
 */
const subscribeToMailingList = catchAsyncError(async (req: Request, res: Response) => {
  const { email } = req.body;

  const existingSubscriber = await mailingListService.findSubscriberByEmail(email);
  if (existingSubscriber) {
    throw new AppError(httpStatus.CONFLICT, 'Email is already subscribed.');
  }

  const subscriber = await mailingListService.addSubscriber({ email });
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Successfully subscribed to the mailing list.',
    data: subscriber,
  });
});

/**
 * Get all mailing list subscribers with pagination.
 * @param req - The incoming request object.
 * @param res - The response object.
 */
const getAllSubscribers = catchAsyncError(async (req: Request, res: Response) => {
  const { page, limit } = req.query as BaseQuery;

  if (isNaN(Number(page)) || isNaN(Number(limit))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid pagination parameters');
  }

  const { results, total } = await mailingListService.getAllSubscribers(req);

  res.status(httpStatus.OK).json({
    success: true,
    data: results,
    total,
    perPage: limit,
  });
});

/**
 * Unsubscribe a user from the mailing list.
 * @param req - The incoming request object.
 * @param res - The response object.
 */
const unsubscribeFromMailingList = catchAsyncError(async (req: Request, res: Response) => {
  const { email } = req.body;

  const removedSubscriber = await mailingListService.removeSubscriberByEmail(email);
  if (!removedSubscriber) {
    throw new AppError(httpStatus.NOT_FOUND, 'Email not found in the mailing list.');
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Successfully unsubscribed from the mailing list.',
  });
});

/**
 * Get a single subscriber by email.
 * @param req - The incoming request object.
 * @param res - The response object.
 */
const getSubscriberByEmail = catchAsyncError(async (req: Request, res: Response) => {
  const { email } = req.params;

  const subscriber = await mailingListService.findSubscriberByEmail(email);
  if (!subscriber) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subscriber not found.');
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: subscriber,
  });
});

export const mailingListController = {
  subscribeToMailingList,
  getAllSubscribers,
  unsubscribeFromMailingList,
  getSubscriberByEmail,
};
