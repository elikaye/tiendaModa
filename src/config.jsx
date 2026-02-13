
// src/config.js

// ========================
// ENTORNO
// ========================
const isProd = import.meta.env.MODE === "production";

// ========================
// BACKEND API
// ========================
export const API_BASE_URL = isProd
  ? import.meta.env.VITE_BACKEND_URL_PROD
  : import.meta.env.VITE_BACKEND_URL_DEV;

// ========================
// BASE DE DATOS (SOLO BACKEND)
// ========================
export const dbConfig = isProd
  ? { url: import.meta.env.VITE_DATABASE_URL } // URL completa MySQL Railway
  : {
      host: import.meta.env.VITE_DB_HOST,
      port: import.meta.env.VITE_DB_PORT,
      user: import.meta.env.VITE_DB_USER,
      password: import.meta.env.VITE_DB_PASSWORD,
      database: import.meta.env.VITE_DB_NAME,
    };

// ========================
// CLOUDINARY (FRONTEND SOLO NOMBRE, PRESET; BACKEND API_KEY/SECRET)
// ========================
export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const CLOUDINARY_BASE_URL =
  `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;

// ========================
// FRONTEND URL
// ========================
export const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";
