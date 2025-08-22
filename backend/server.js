const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Configuración de variables de entorno
dotenv.config();

// Conexión a la base de datos
const sequelize = require('./config/database');

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

// Crear instancia de la app de Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// 🔧 Configurar CORS para Railway (producción)
app.use(cors({
  origin: "https://tiendamoda-produccion-280c.up.railway.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Servir archivos estáticos si tuvieras otros assets
app.use('/static', express.static(path.join(__dirname, 'public')));

// Usar rutas
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ API funcionando con Sequelize, MySQL y Cloudinary 🚀');
});

// Middleware para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error global:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Configurar puerto
const PORT = process.env.PORT || 5000;

// Conectar DB y levantar servidor
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
