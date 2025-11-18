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
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]",

      // Obtener JSON parseado
      get() {
        const raw = this.getDataValue("productos");
        try {
          return JSON.parse(raw);
        } catch {
          return [];
        }
      },

      // Guardar siempre como string
      set(value) {
        this.setDataValue("productos", JSON.stringify(value));
      }
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: "Favorito",
    tableName: "favoritos",
    timestamps: false,
    underscored: true,
    paranoid: false
  }
);

export default Favorito;
