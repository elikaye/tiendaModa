// API base (Railway)
export const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/v1"
    : import.meta.env.VITE_API_BASE_URL;

// Cloudinary
export const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
