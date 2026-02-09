// config.js

// API base (Railway)
export const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/v1"
    : "https://tiendamoda-production-280c.up.railway.app/api/v1";

// Cloudinary
export const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dagwbvilx/image/upload/";
export const CLOUDINARY_CLOUD_NAME = "dagwbvilx";
export const CLOUDINARY_UPLOAD_PRESET = "ecommerce_unsigned";

