import sequelize from '../config/database.js';

import Cart from './Cart.js';         // carritos
import Order from './order.js';       // ordenes_final
import User from './user.js';         // users
import Product from './product.js';   // products
import Favorito from './favorito.js'; // favoritos

// ---- Relaciones Cart ----
User.hasOne(Cart, { foreignKey: 'user_id', as: 'usuarioCart' });
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'cartUsuario' });

// ---- Relaciones Order ----
User.hasMany(Order, { foreignKey: 'user_id', as: 'usuarioOrders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'orderUsuario' });

// ---- Relaciones Favorito ----
User.hasMany(Favorito, { foreignKey: 'user_id', as: 'usuarioFavoritos' });
Favorito.belongsTo(User, { foreignKey: 'user_id', as: 'favoritoUsuario' });

// ---- Relaciones Product (opcional) ----
// Si querés relacionar Favorito con Product:
// Favorito.belongsTo(Product, { foreignKey: 'product_id', as: 'productoFavorito' });

export {
  sequelize,
  Cart,
  Order,
  User,
  Product,
  Favorito,
};
