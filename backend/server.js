const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize } = require('./config/database');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// CORS dinámico y seguro para desarrollo y producción
const allowedOrigins = [
  'http://localhost:5173',
  'https://tiendamoda-production.up.railway.app',
  // Agrega aquí la URL de tu frontend en Netlify cuando la tengas deployada, por ejemplo:
  // 'https://tu-frontend.netlify.app'
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

// Servir imágenes estáticas
app.use('/product', express.static(path.join(__dirname, '../public/products')));

// Rutas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('✅ API funcionando con Sequelize y MySQL 🚀');
});

// Middleware para manejo global de errores (opcional pero recomendable)
app.use((err, req, res, next) => {
  console.error('Error global:', err.message);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Conexión con Sequelize y arranque del servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a MySQL con Sequelize');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar con Sequelize:', err.message);
    process.exit(1);
  });
