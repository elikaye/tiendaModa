import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { sequelize } from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ==== Conexión a la DB ====
const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados (alter)');
    } else {
      await sequelize.sync();
    }

  } catch (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
    process.exit(1);
  }
};

// ==== Middlewares ====
app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// ==== Rutas estáticas ====
app.use('/product', express.static(path.join(__dirname, '../public/product')));

// ==== Rutas de API ====
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

// ==== Diagnóstico de imagen (opcional) ====
const testImagePath = path.join(__dirname, '../public/product/producto1.jpeg');
fs.access(testImagePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('⚠️ Imagen de prueba no encontrada en:', testImagePath);
  } else {
    console.log('✅ Imagen de prueba encontrada en:', testImagePath);
  }
});

// ==== Middleware de errores ====
app.use((err, req, res, next) => {
  console.error('❌ Error interno del servidor:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ==== Iniciar servidor ====
const startServer = async () => {
  await initializeDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
};

startServer();
