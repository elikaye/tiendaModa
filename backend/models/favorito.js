
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
      // ✅ MySQL no soporta JSON puro en todas las versiones de Railway,
      // pero lo maneja como TEXT correctamente si controlamos el parseo.
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '[]',
      get() {
        const rawValue = this.getDataValue('productos');
        try {
          return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
        } catch {
          return [];
        }
      },
      set(value) {
        try {
          // ✅ Recuperamos el valor actual
          const actualRaw = this.getDataValue('productos');
          const actual = typeof actualRaw === 'string'
            ? JSON.parse(actualRaw || '[]')
            : Array.isArray(actualRaw)
            ? actualRaw
            : [];

          if (value && !Array.isArray(value)) {
            // ✅ Si llega un solo producto, lo agregamos
            const existe = actual.some((p) => p.id === value.id);
            if (!existe) actual.push(value);
            this.setDataValue('productos', JSON.stringify(actual));
          } else if (Array.isArray(value)) {
            // ✅ Si llega un array, fusionamos sin duplicados
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
