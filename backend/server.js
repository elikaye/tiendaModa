// server.js
const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// ---- CORS global para todas las rutas ----
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // temporal: permite cualquier frontend
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(204); // responder preflight
  next();
});

// ---- Rutas ----
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) => res.send('✅ API funcionando con Sequelize, MySQL y Cloudinary 🚀'));

// ---- Manejo de rutas no encontradas ----
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// ---- Middleware global de errores ----
app.use((err, req, res, next) => {
  console.error('🔴 Error global:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ---- Inicio del servidor ----
const PORT = process.env.PORT || 5000;

// Arranca el servidor primero, luego intenta conectar Sequelize
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL con Sequelize');
  } catch (err) {
    console.error('❌ Error al conectar con Sequelize:', err.message);
  }
});
