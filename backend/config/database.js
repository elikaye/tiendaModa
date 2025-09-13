const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Obtener variables de entorno, usando alternativas si no existen
const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'tienda_moda';
const dbUser = process.env.DB_USER || process.env.MYSQLUSER || 'root';
const dbPass = process.env.DB_PASS || process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '';
const dbHost = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
const dbPort = Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306;

// Opcional: mostrar advertencias solo si no se definió nada
if (!process.env.DB_NAME && !process.env.MYSQLDATABASE) console.warn('⚠️ DB_NAME no definida, usando valor por defecto');
if (!process.env.DB_USER && !process.env.MYSQLUSER) console.warn('⚠️ DB_USER no definida, usando valor por defecto');
if (!process.env.DB_PASS && !process.env.DB_PASSWORD && !process.env.MYSQLPASSWORD) console.warn('⚠️ DB_PASS no definida, usando vacío');
if (!process.env.DB_HOST && !process.env.MYSQLHOST) console.warn('⚠️ DB_HOST no definida, usando localhost');

// Crear instancia de Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: 'mysql',
  port: dbPort,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    paranoid: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
