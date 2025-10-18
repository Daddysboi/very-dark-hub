import mongoose from 'mongoose';
import logger from '../utils/logger';
import AppError from '../utils/AppError';

export const dbConnection = async () => {
  const connectionString = process.env.MONGODB_URL;

  if (!connectionString) {
    logger.error('MongoDB Url environment variable is not set!');
    process.exit(1);
  }

  try {
    const connect = await mongoose.connect(connectionString);
    logger.info(`DB connected @ ${connect.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      logger.warn('Database connection closed.');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('Database reconnected.');
    });
  } catch (error) {
    if (error instanceof AppError) {
      logger.error(`DB connection failed: ${error.message}`);
    } else {
      logger.error('DB connection failed with an unknown error');
    }
    process.exit(1);
  }
};
