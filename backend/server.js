// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// ---- CORS ----
const allowedOrigins = [
  "http://localhost:5173",
  "https://tiendamoda-produccion-280c.up.railway.app"
];

// Middleware CORS seguro
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Responder a preflight request
  if (req.method === 'OPTIONS') return res.sendStatus(204);

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

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a MySQL con Sequelize');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error al conectar con Sequelize:', err.message);
    process.exit(1);
  });
