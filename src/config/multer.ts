/* eslint-disable @typescript-eslint/no-explicit-any */
import multer, { FileFilterCallback } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import { Request } from 'express';
import httpStatus from 'http-status';
import cloudinary from "./cloudinary";
import logger from "../utils/logger";
import AppError from "../utils/AppError";

const upload = (name: string, role: string) => {
  const folder = `${name} File`;

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      resource_type: 'auto',
      public_id: (_req: Request, file: Express.Multer.File) => {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
        const uniqueFileName = `${role}-${uniqueSuffix}-${file.originalname}`;
        logger.info(`Uploading file: ${uniqueFileName}`);
        return uniqueFileName;
      },
      transformation: [
        { width: 800, height: 600, crop: 'fill' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    } as any,
  });

  return multer({
    storage: storage,
    fileFilter: function (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
      checkFileType(file, cb);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 5,
    },
  });
};

const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|pdf|mp3|m4b|aac|wav|flac|ogg|wma|epub|mobi|azw|kf8|fb2|cbz|cbr|webm/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new AppError(httpStatus.BAD_REQUEST, 'Kindly upload a valid filetype.'));
  }
};

// Define multer local storage
const storageConfig = multer.diskStorage({
  destination: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    let uploadPath = 'uploads/';

    if (file.mimetype.startsWith('image')) {
      uploadPath += 'images/';
    } else if (file.mimetype === 'application/pdf') {
      uploadPath += 'pdfs/';
    } else {
      return cb(new Error('Mime type not supported'), '');
    }

    cb(null, uploadPath);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export { upload, storageConfig };
