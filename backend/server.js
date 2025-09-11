// server.js
const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

dotenv.config();
const app = express();

// ---- CORS ----
const allowedOrigins = [
  "http://localhost:5173", // desarrollo local
  "https://tiendamoda-produccion-280c.up.railway.app", // backend Railway
  "https://tudominio.netlify.app" // 🚀 reemplazar con la URL real de Netlify cuando hagas el deploy
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true);
    } else {
      console.warn(`❌ Bloqueado por CORS: ${origin}`);
      callback(new Error('CORS no permitido'));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// ---- Preflight OPTIONS para todas las rutas ----
app.options('*', cors());

// ---- Ruta de prueba CORS ----
app.get('/test-cors', (req, res) => {
  res.json({ message: '✅ CORS funcionando!' });
});

// ---- Middleware JSON ----
app.use(express.json());

// ---- Rutas ----
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

app.get('/', (req, res) => {
  res.send('✅ API funcionando con Sequelize, MySQL y Cloudinary 🚀');
});

// ---- 404 ----
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// ---- Middleware global de errores ----
app.use((err, req, res, next) => {
  console.error('🔴 Error global:', err.message);
  if(err.message.includes('CORS')){
    return res.status(403).json({ message: err.message });
  }
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
