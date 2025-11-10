import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Favorito extends Model {}

Favorito.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productos: {
      type: DataTypes.TEXT, // ✅ cambiamos de JSON a TEXT para compatibilidad total con MySQL
      allowNull: false,
      defaultValue: '[]',
      get() {
        const rawValue = this.getDataValue('productos');
        try {
          return JSON.parse(rawValue || '[]');
        } catch {
          return [];
        }
      },
      set(value) {
        this.setDataValue('productos', JSON.stringify(value || []));
      },
    },
  },
  {
    sequelize,
    modelName: 'Favorito',
    tableName: 'favoritos',
    timestamps: true,
    underscored: true,
    paranoid: false,
  }
);

export default Favorito;
