const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

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

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // permite Postman o requests sin origin
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error(`CORS para ${origin} no permitido`), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Permitir preflight para todas las rutas
app.options('*', cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// ---- Rutas ----
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) => res.send('✅ API funcionando con Sequelize, MySQL y Cloudinary 🚀'));

// ---- Manejo de rutas no encontradas ----
app.use((req, res, next) => res.status(404).json({ message: 'Ruta no encontrada' }));

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
