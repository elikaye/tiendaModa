// server.js
const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database'); // asegúrate que tu config use process.env para host, user, pass, db
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

dotenv.config();
const app = express();

// ---- CORS ----
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://tiendamoda-produccion-280c.up.railway.app",
  "https://tudominio.netlify.app" // reemplazar por tu dominio real
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ Bloqueado por CORS: ${origin}`);
      callback(null, false); // no bloquea preflight, evita que el navegador corte la petición
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// Middleware para responder correctamente a OPTIONS en todas las rutas
app.options('*', cors({
  origin: allowedOrigins,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// Middleware JSON
app.use(express.json());

// ---- Rutas ----
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

app.get('/', (req, res) => {
  res.send('✅ API funcionando con Sequelize, MySQL y Cloudinary 🚀');
});

// Ruta de prueba CORS
app.get('/test-cors', (req, res) => {
  console.log('💡 /test-cors llamada');
  res.json({ message: '✅ CORS funcionando!' });
});

// 404
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error global:', err.message);
  if(err.message.includes('CORS')){
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ---- Inicio del servidor ----
const PORT = process.env.PORT || 5000;

// Verificación de variables de entorno críticas
const requiredEnvs = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'CLOUD_NAME', 'API_KEY', 'API_SECRET'];
requiredEnvs.forEach(key => {
  if(!process.env[key]){
    console.warn(`⚠️ Variable de entorno faltante: ${key}`);
  }
});

// Autenticación y levantado del servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a MySQL con Sequelize');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en Railway en el puerto ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error al conectar con Sequelize:', err.message);
    process.exit(1); // Esto detendrá el contenedor si la DB no se conecta
  });
