import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { Sequelize } from 'sequelize';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: process.env.NODE_ENV === 'development',
  }
);

const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected ✅');
    // Sync solo en desarrollo para evitar alteraciones en producción
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Models synced ✅');
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
};

app.use(helmet());

// Actualiza el origen CORS con la URL de tu frontend deployado cuando la tengas
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CORS_ORIGIN // la definís en .env con tu URL de frontend en producción
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Sirve imágenes desde la carpeta pública con path absoluto
app.use('/product', express.static(path.join(process.cwd(), 'public/product')));

// Rutas para usuarios y productos
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

// Diagnóstico: verifica si la imagen existe (opcional, para debugging)
const testImagePath = path.join(process.cwd(), 'public/product/producto1.jpeg');
fs.access(testImagePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('ERROR: No se encontró la imagen en:', testImagePath);
  } else {
    console.log('OK: Imagen encontrada en:', testImagePath);
  }
});

// Middleware para manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const startServer = async () => {
  await initializeDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
};

startServer();
