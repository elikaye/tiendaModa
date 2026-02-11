
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const dbName = isProduction
  ? process.env.DB_NAME_PROD
  : process.env.DB_NAME;

const dbUser = isProduction
  ? process.env.DB_USER_PROD
  : process.env.DB_USER;

const dbPass = isProduction
  ? process.env.DB_PASSWORD_PROD
  : process.env.DB_PASSWORD;

const dbHost = isProduction
  ? process.env.DB_HOST_PROD
  : process.env.DB_HOST;

const dbPort = isProduction
  ? Number(process.env.DB_PORT_PROD)
  : Number(process.env.DB_PORT);

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: "mysql",
  port: dbPort,
  logging: !isProduction,
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

export default sequelize;
