
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const path = require('path');

dotenv.config();
const app = express();

app.use(express.json());

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

// Servir imágenes estáticas
app.use('/product', express.static(path.join(__dirname, 'public/product')));

// Rutas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) => {
  res.send('✅ API funcionando correctamente en Railway con MySQL 🚂');
});

// Crear conexión con MySQL, incluyendo puerto
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Conectar y levantar servidor solo si la conexión es exitosa
db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err.message);
    console.error(err);
    process.exit(1); // Cierra la app para que Railway detecte y reinicie si es necesario
  } else {
    console.log('✅ Conectado a MySQL');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  }
});
