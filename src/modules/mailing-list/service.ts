/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import httpStatus from 'http-status';

import MailingList from './model';
import { IMailingListSubscriber } from './types';
import { executePaginatedQuery } from '../../utils/paginatedQuery';
import { BaseQuery } from '../user/types';
import AppError from '../../utils/AppError';

/**
 * Finds a subscriber by email.
 * @param email - The email of the subscriber to find.
 * @returns The found subscriber or null.
 */
const findSubscriberByEmail = async (email: string): Promise<IMailingListSubscriber | null> => {
  return MailingList.findOne({ email });
};

/**
 * Adds a new subscriber to the mailing list.
 * @param subscriberData - The data of the subscriber to add.
 * @returns The newly added subscriber.
 */
const addSubscriber = async (subscriberData: { email: string; name?: string }): Promise<IMailingListSubscriber> => {
  const newSubscriber = new MailingList(subscriberData);
  return await newSubscriber.save();
};

/**
 * Retrieves all mailing list subscribers with pagination.
 * @param req
 @returns A paginated list of subscribers.
 */
async function getAllSubscribers(req: Request): Promise<{ results: IMailingListSubscriber[]; total: number }> {
  const { page, limit, createdAt } = req.query as BaseQuery;
  const query: any = {};

  if (createdAt) {
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid date format for createdAt');
    }
    query.createdAt = { $gte: date };
  }

  const { results, total } = await executePaginatedQuery<IMailingListSubscriber>(MailingList, query, Number(page), Number(limit));
  return { results: results, total };
}

/**
 * Removes a subscriber from the mailing list by email.
 * @param email - The email of the subscriber to remove.
 * @returns The removed subscriber or null if not found.
 */
const removeSubscriberByEmail = async (email: string): Promise<IMailingListSubscriber | null> => {
  return MailingList.findOneAndDelete({ email });
};

export const mailingListService = {
  findSubscriberByEmail,
  addSubscriber,
  getAllSubscribers,
  removeSubscriberByEmail,
};
