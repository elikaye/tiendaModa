
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('products', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING(500), // Más largo para URLs de Cloudinary
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'activo'
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  subcategoria: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  destacados: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

talles: {
  type: DataTypes.STRING,
  allowNull: true
},
colores: {
  type: DataTypes.STRING,
  allowNull: true
},
medidas: {
  type: DataTypes.STRING,
  allowNull: true
},
imagePublicId: {
  type: DataTypes.STRING,
  allowNull: true
},  
}, {
  tableName: 'products',
  timestamps: true,
  paranoid: true,
  deletedAt: 'deletedAt'
});

module.exports = Product;
