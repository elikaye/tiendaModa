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

      get() {
        const raw = this.getDataValue("productos");
        try {
          return JSON.parse(raw);
        } catch {
          return [];
        }
      },

      set(value) {
        this.setDataValue("productos", JSON.stringify(value));
      }
    }
  },
  {
    sequelize,
    modelName: "Favorito",
    tableName: "favoritos",
    timestamps: true,   // <-- Sequelize maneja created_at y updated_at
    underscored: true,  // usa created_at / updated_at
    paranoid: false
  }
);

export default Favorito;
