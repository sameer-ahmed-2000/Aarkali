import { v2 as cloudinary } from 'cloudinary';

// Configure cloudinary
// It automatically picks up CLOUDINARY_URL from the environment if present
// or you can configure it explicitly if you have separate keys.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
