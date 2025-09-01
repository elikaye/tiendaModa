// server.js
const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

dotenv.config();

const app = express();

// ---- CORS primero ----
const allowedOrigins = [
  "http://localhost:5173", // frontend local
  "https://tiendamoda-produccion-280c.up.railway.app" // frontend producción
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ Bloqueado por CORS: ${origin}`);
      callback(new Error("CORS no permitido por este origen"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
// Habilitar preflight (OPTIONS) para todas las rutas
app.options("*", cors(corsOptions));

// ---- Middleware JSON ----
app.use(express.json());

// ---- Rutas ----
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) =>
  res.send('✅ API funcionando con Sequelize, MySQL y Cloudinary 🚀')
);

// ---- 404 ----
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// ---- Errores globales ----
app.use((err, req, res, next) => {
  console.error('🔴 Error global:', err.message);
  if (err.message.includes("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ---- Puerto Railway ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en ${PORT}`));
