import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '', // en caso que la contraseña esté vacía
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
   logging: process.env.NODE_ENV === 'development' ? console.log : false,

  }
);
