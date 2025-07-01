import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { Sequelize } from 'sequelize';
import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
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
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Models synced ✅');
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
};

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json({ limit: '10mb' }));

// Ruta estática para imágenes con path absoluto
app.use('/product', express.static(path.join(process.cwd(), '/public/product')));

// Diagnóstico: Verificar que la imagen exista
const testImagePath = path.join(process.cwd(), 'public/product/producto1.jpeg');
fs.access(testImagePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('ERROR: No se encontró la imagen en:', testImagePath);
  } else {
    console.log('OK: Imagen encontrada en:', testImagePath);
  }
});

// Rutas API
app.use('/api/v1/products', productRoutes);

// Middleware manejo de errores
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
