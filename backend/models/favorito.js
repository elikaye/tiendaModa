import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Favorito extends Model {}

Favorito.init(
  {
    id: { 
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: { 
      type: DataTypes.INTEGER,
      allowNull: false
    },

    productos: { 
      type: DataTypes.JSON,      // ✔️ ESTE ERA EL ERROR
      allowNull: false,
      defaultValue: [],

      get() {
        const raw = this.getDataValue("productos");
        return Array.isArray(raw) ? raw : [];
      },

      set(value) {
        this.setDataValue("productos", value);
      }
    }
  },
  {
    sequelize,
    modelName: "Favorito",
    tableName: "favoritos",
    timestamps: true,
    underscored: true,
    paranoid: false
  }
);

export default Favorito;
