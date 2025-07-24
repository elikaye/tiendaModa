const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize } = require('./config/database');

dotenv.config();
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// CORS habilitado solo para el frontend local en puerto 5173
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Servir imágenes estáticas desde la carpeta public/product
app.use('/product', express.static(path.join(__dirname, 'public', 'product')));

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

// Usar rutas
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

// Ruta raíz para comprobar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('✅ API funcionando con Sequelize y MySQL 🚀');
});

// Middleware global para manejo de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error global:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Conexión a la base de datos y levantar servidor
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
