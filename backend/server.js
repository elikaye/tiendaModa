const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize } = require('./config/database');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// ✅ CORS dinámico y seguro
const allowedOrigins = [
  'http://localhost:5173', // desarrollo local
  'https://tiendamoda-production.up.railway.app', // backend en Railway
  'https://tu-frontend.netlify.app' // ⚠️ reemplazá con la URL real del frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('❌ CORS bloqueado:', origin);
      callback(new Error('No permitido por CORS: ' + origin));
    }
  },
  credentials: true
}));

// ✅ Servir imágenes estáticas de productos
app.use('/product', express.static(path.join(__dirname, 'public', 'products')));

// Rutas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

// Ruta raíz para comprobar funcionamiento
app.get('/', (req, res) => {
  res.send('✅ API funcionando con Sequelize y MySQL 🚀');
});

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error global:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Conexión a la base de datos y arranque del servidor
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a MySQL con Sequelize');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar con Sequelize:', err.message);
    process.exit(1);
  });
