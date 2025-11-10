import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
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
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  delete_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'ordenes_final',
  timestamps: false,
  paranoid: true,
  deletedAt: 'delete_at'
});

export default Order;
