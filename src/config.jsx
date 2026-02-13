// config.js

// ========================
// API BASE
// ========================
export const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? `${import.meta.env.VITE_BACKEND_URL_DEV}/api/v1`
    : `${import.meta.env.VITE_BACKEND_URL_PROD}/api/v1`;

// ========================
// CLOUDINARY
// ========================
export const CLOUDINARY_BASE_URL =
  import.meta.env.VITE_CLOUDINARY_BASE_URL;

export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
