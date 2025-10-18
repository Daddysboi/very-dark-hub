import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import config from './envConfig';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export const uploadToCloudinary = (
  buffer: Buffer,
  publicId: string,
  folder: string,
): Promise<{
  secure_url: string;
}> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder: folder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({ secure_url: result.secure_url });
        }
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default cloudinary;
