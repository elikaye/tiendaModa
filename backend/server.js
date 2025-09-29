// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database'); // usa process.env para host, user, pass, db
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();

// ---- CORS ----
// PARA DESARROLLO: permitir cualquier origen (solo temporal)
app.use(cors({
  origin: true, // permite cualquier origen
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// Middleware para preflight (OPTIONS)
app.options('*', cors({
  origin: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// Middleware JSON
app.use(express.json());

// ---- Rutas ----
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

// Test
app.get('/', (req, res) => {
  res.send('✅ API funcionando con Sequelize, MySQL y Cloudinary 🚀');
});

app.get('/test-cors', (req, res) => {
  console.log('💡 /test-cors llamada');
  res.json({ message: '✅ CORS funcionando!' });
});

// 404
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error global:', err.message);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ---- Inicio del servidor ----
const PORT = process.env.PORT || 5000;

// Verificación de variables críticas
const requiredEnvs = [
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

requiredEnvs.forEach(key => {
  if (!process.env[key]) {
    console.warn(`⚠️ Variable de entorno faltante: ${key}`);
  }
});

// Conexión a la DB y levantado del servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a MySQL con Sequelize');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en Railway en el puerto ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error al conectar con Sequelize:', err.message);
    process.exit(1);
  });
