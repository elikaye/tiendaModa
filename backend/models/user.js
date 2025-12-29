
import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

class User extends Model {
  async comparePassword(passwordPlain) {
    return await bcrypt.compare(passwordPlain, this.password);
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: { type: DataTypes.STRING, allowNull: false, defaultValue: 'cliente' },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',

    // 🚫 El default oculta password
    defaultScope: {
      attributes: { exclude: ['password'] },
    },

    // ✅ ESTE SCOPE FORZA A MOSTRAR PASSWORD
    scopes: {
      withPassword: {
        attributes: {
          include: ['password'],
          exclude: [], // ← ESTA LÍNEA ARREGLA TODO
        },
      },
    },

    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
