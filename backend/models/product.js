const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Importa la instancia directamente

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre no puede estar vacío' },
      len: {
        args: [3, 100],
        msg: 'El nombre debe tener entre 3 y 100 caracteres',
      },
    },
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'El precio debe ser un número decimal' },
      min: {
        args: [0],
        msg: 'El precio no puede ser negativo',
      },
    },
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    set(value) {
      if (value && !value.startsWith('/') && !value.startsWith('http')) {
        this.setDataValue('imageUrl', '/product/' + value.trim());
      } else if (value) {
        this.setDataValue('imageUrl', value.trim());
      }
    },
    validate: {
      isValidUrlOrPath(value) {
        if (value && !value.match(/^(\/|https?:\/\/)[^\s]+$/)) {
          throw new Error('Debe ser una ruta relativa (ej: /product/producto1.jpeg) o una URL válida');
        }
      },
    },
  },
}, {
  tableName: 'products',
  timestamps: true,
  hooks: {
    beforeValidate: (product) => {
      if (product.name) {
        product.name = product.name.trim();
      }
      if (product.description) {
        product.description = product.description.trim();
      }
    },
  },
  indexes: [
    {
      unique: false,
      fields: ['name'],
    },
  ],
});

module.exports = Product;
