// models/FrontendSettings.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const FrontendSettings = sequelize.define("FrontendSettings", {
  bannerUrl: DataTypes.STRING,
  bannerBlur: DataTypes.STRING,
  cintaTexto: DataTypes.STRING,
  cintaVisible: DataTypes.BOOLEAN,
}, {
  tableName: "frontend_settings",
  timestamps: true,
  paranoid: false, // ← desactiva deletedAt
});

export default FrontendSettings;
