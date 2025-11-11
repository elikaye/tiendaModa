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
      type: DataTypes.TEXT, // ✅ compatibilidad total con MySQL
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
        try {
          // ✅ Leemos lo que ya hay guardado
          const actual = JSON.parse(this.getDataValue('productos') || '[]');

          // ✅ Si llega un solo producto (objeto), lo agregamos al array existente
          if (value && !Array.isArray(value)) {
            const existe = actual.some((p) => p.id === value.id);
            if (!existe) actual.push(value);
            this.setDataValue('productos', JSON.stringify(actual));
          } else {
            // ✅ Si llega un array completo, lo fusionamos sin duplicados
            const nuevos = [...actual];
            value.forEach((p) => {
              if (!nuevos.some((x) => x.id === p.id)) nuevos.push(p);
            });
            this.setDataValue('productos', JSON.stringify(nuevos));
          }
        } catch (err) {
          console.error('❌ Error al setear productos en Favorito:', err);
          this.setDataValue('productos', JSON.stringify(value || []));
        }
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
