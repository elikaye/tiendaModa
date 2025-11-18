
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
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
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
    paranoid: false // 👈 esto evita deleted_at
  }
);

export default Favorito;
