import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Producción
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: false,
  });
} else {
  // Desarrollo local con proxy Railway
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      port: process.env.DB_PORT,
      logging: console.log,
      dialectOptions: {
        connectTimeout: 10000, // 10 segundos para evitar ETIMEDOUT
      },
    }
  );
}

export default sequelize;
