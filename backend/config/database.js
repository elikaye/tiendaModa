const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: Number(process.env.DB_PORT) || 3306,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      // Para que no cree columnas con timestamps si no las definís explícitamente
      timestamps: true, // si querés timestamps por defecto, sino poner false
      paranoid: true,   // activa el borrado suave si querés
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
