import { v2 as cloudinary } from "cloudinary";
import "server-only";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export { cloudinary };

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}
