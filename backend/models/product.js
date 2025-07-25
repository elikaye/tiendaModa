const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    validate: {
      isInt: true
    }
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre es obligatorio'
      },
      len: {
        args: [2, 100],
        msg: 'El nombre debe tener entre 2 y 100 caracteres'
      },
      is: {
        args: /^[\p{L}\d\s\-_.,;:()&@#'"!?¿¡%$€¥£]+$/u,
        msg: 'Contiene caracteres no permitidos'
      }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 2000],
        msg: 'La descripción no puede exceder 2000 caracteres'
      }
    }
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Debe ser un número decimal válido'
      },
      min: {
        args: [0.01],
        msg: 'El precio mínimo es 0.01'
      },
      max: {
        args: [9999999.99],
        msg: 'El precio máximo es 9,999,999.99'
      }
    },
    get() {
      const value = this.getDataValue('precio');
      return value ? parseFloat(value) : null;
    }
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isValidUrlOrPath(value) {
        if (value && !value.match(/^(\/|https?:\/\/)[^\s]+$/)) {
          throw new Error('Debe ser una ruta relativa (ej: /static/product/producto1.jpeg) o una URL válida');
        }
      }
    }
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'agotado'),
    defaultValue: 'activo',
    validate: {
      isIn: [['activo', 'inactivo', 'agotado']]
    }
  },
  categoria: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La categoría es obligatoria'
      },
      len: {
        args: [2, 50],
        msg: 'La categoría debe tener entre 2 y 50 caracteres'
      }
    }
  },
  subcategoria: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  destacados: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'products',
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt']
    }
  },
  hooks: {
    beforeCreate: (product) => {
      if (product.nombre) product.nombre = product.nombre.trim();
      if (product.descripcion) product.descripcion = product.descripcion.trim();
      if (product.categoria) product.categoria = product.categoria.trim();
    },
    beforeUpdate: (product) => {
      product.updatedAt = new Date();
    }
  },
  indexes: [
    { name: 'idx_product_nombre', fields: ['nombre'], using: 'BTREE' },
    { name: 'idx_product_precio', fields: ['precio'], using: 'BTREE' },
    { name: 'idx_product_estado', fields: ['estado'], using: 'BTREE' },
    { name: 'idx_product_categoria', fields: ['categoria'], using: 'BTREE' }
  ]
});

module.exports = { Product };
