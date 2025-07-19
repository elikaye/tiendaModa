const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// CORS Config
const allowedOrigins = [
  'http://localhost:5173',
  'https://tiendamoda-production.up.railway.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS: ' + origin));
    }
  },
  credentials: true
}));

// Conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err.message);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

// Rutas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ API funcionando correctamente en Railway con MySQL 🚂');
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
