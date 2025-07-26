// Importaciones necesarias
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Configuración de variables de entorno
dotenv.config();

// Importación de la conexión con Sequelize (sin destructuring)
const sequelize = require('./config/database');

// Crear instancia de la app de Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

// Servir archivos estáticos (imágenes de productos)
app.use('/product', express.static(path.join(__dirname, 'public', 'product')));

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

// Usar las rutas
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

// Ruta de prueba para comprobar que el servidor responde
app.get('/', (req, res) => {
  res.send('✅ API funcionando con Sequelize y MySQL 🚀');
});

// Middleware para rutas no encontradas (catch-all)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error global:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Configurar el puerto desde .env o usar 5000 por defecto
const PORT = process.env.PORT || 5000;

// Iniciar la conexión a la base de datos y levantar el servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a MySQL con Sequelize');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar con Sequelize:', err.message);
    process.exit(1); // Salir si no se puede conectar
  });
