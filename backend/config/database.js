const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE;
const dbUser = process.env.DB_USER || process.env.MYSQLUSER;
const dbPass = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD;
const dbHost = process.env.DB_HOST || process.env.MYSQLHOST;
const dbPort = Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306;

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
