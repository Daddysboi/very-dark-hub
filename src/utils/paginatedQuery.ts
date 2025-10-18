import { Document, Model, FilterQuery, Query } from 'mongoose';
import AppError from './AppError';
import httpStatus from 'http-status';

export type PaginationOptions = {
  populate?: string | any;
  select?: string | string[];
  sort?: Record<string, 1 | -1>;
  lean?: boolean;
};

type PaginatedResult<T> = {
  results: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
};

export async function executePaginatedQuery<T extends Document>(
  model: Model<T>,
  filter: FilterQuery<T>,
  page = 1,
  limit = 10,
  options: PaginationOptions = {},
): Promise<PaginatedResult<T>> {
  try {
    const { skip, limit: validatedLimit } = getPagination(page, limit);

    let query: Query<T[], T> = model.find(filter).notDeleted().skip(skip).limit(validatedLimit);

    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);

    // Apply sorting - use options.sort if provided, otherwise default to createdAt desc
    if (options.sort) {
      query = query.sort(options.sort);
    } else {
      // Default sort by most recent
      query = query.sort({ createdAt: -1 });
    }

    // Optimize count operation based on whether we have filters
    let countOperation;
    if (Object.keys(filter).length === 0) {
      countOperation = model.estimatedDocumentCount().exec();
    } else {
      countOperation = model.countDocuments(filter).lean().exec();
    }

    if (options.lean) {
      const [results, total] = await Promise.all([query.lean().exec(), countOperation]);
      return {
        results: results as unknown as T[],
        total,
        page: Math.min(page, Math.ceil(total / validatedLimit) || 1),
        pages: Math.ceil(total / validatedLimit) || 1,
        limit: validatedLimit,
      };
    } else {
      const [results, total] = await Promise.all([query.exec(), countOperation]);
      return {
        results,
        total,
        page: Math.min(page, Math.ceil(total / validatedLimit) || 1),
        pages: Math.ceil(total / validatedLimit) || 1,
        limit: validatedLimit,
      };
    }
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export function buildQueryFilters(
  createdAt?: string,
  startDate?: string,
  endDate?: string,
  keyword?: string,
  searchFields: string[] = [],
): Record<string, any> {
  const query: Record<string, any> = {};

  // Handle date filtering (support both legacy and new approaches)
  if (createdAt || startDate || endDate) {
    // Legacy createdAt filter takes precedence if provided
    if (createdAt) {
      const date = new Date(createdAt);
      if (!isNaN(date.getTime())) {
        query.createdAt = { $gte: date };
      } else {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid createdAt date format');
      }
    }

    // Parse start and end date
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Validate
    if (start && isNaN(start.getTime())) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid start date format');
    }
    if (end && isNaN(end.getTime())) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid end date format');
    }

    // Adjust times to cover the full day
    if (start) {
      start.setHours(0, 0, 0, 0); // Start of day
    }
    if (end) {
      end.setHours(23, 59, 59, 999); // End of day
    }

    // Build query
    if (start && end) {
      if (start > end) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Start date cannot be after end date');
      }
      query.createdAt = { $gte: start, $lte: end };
    } else if (start) {
      query.createdAt = { $gte: start };
    } else if (end) {
      query.createdAt = { $lte: end };
    }
  }

  // Rest of your existing keyword search logic remains unchanged
  if (keyword?.trim() && searchFields.length) {
    const keywordStr = keyword.trim();
    query.$or = [];

    // Numeric fields (exact match)
    const numericFields = ['amount', 'price'];
    if (!isNaN(Number(keywordStr))) {
      numericFields.filter((field) => searchFields.includes(field)).forEach((field) => query.$or.push({ [field]: Number(keywordStr) }));
    }

    // String fields (regex search)
    searchFields
      .filter((field) => !numericFields.includes(field))
      .forEach((field) => {
        let searchKeyword = keywordStr;
        if (field === 'resource') {
          searchKeyword = keywordStr.replace(/ /g, '_');
        }
        query.$or.push({
          [field]: { $regex: escapeRegex(searchKeyword), $options: 'i' },
        });
      });

    if (query.$or.length === 0) {
      delete query.$or;
    }
  }

  return query;
}

// Helper functions
function getPagination(page: number, limit: number) {
  return {
    skip: (Math.max(1, page) - 1) * Math.max(1, Math.min(limit, 100)),
    limit: Math.max(1, Math.min(limit, 100)),
  };
}

function handleDatabaseError(error: unknown): never {
  if (error instanceof Error) {
    if (error.name === 'CastError') {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid data type in query');
    }
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Database error: ${error.message}`);
  }
  throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Unknown database error');
}

function escapeRegex(string: string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
