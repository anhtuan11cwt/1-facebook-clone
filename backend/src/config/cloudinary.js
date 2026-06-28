import "dotenv/config";
import { PassThrough } from "node:stream";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

const bufferToStream = (buffer) => {
  const stream = new PassThrough();
  stream.end(buffer);
  return stream;
};

export const uploadFileToCloudinary = (file, folder = "1-facebook-clone") => {
  return new Promise((resolve, reject) => {
    const isVideo = file.mimetype.startsWith("video");
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? "video" : "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    bufferToStream(file.buffer).pipe(uploadStream);
  });
};

export { cloudinary };
