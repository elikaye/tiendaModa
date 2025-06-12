import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT, allowNull: false },
  imageUrl: { type: DataTypes.STRING },
}, {
  timestamps: true,
  tableName: 'products',
})
