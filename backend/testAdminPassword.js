require('dotenv').config();
const sequelize = require('./config/database'); // ajustá la ruta
const User = require('./models/user'); // ajustá la ruta
const bcrypt = require('bcrypt');

async function verificarAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✔ Conectado a la base de datos');

    const emailAdmin = 'barbytienda30@gmail.com';
    const passwordIngresada = 'InduBarbie#2025'; // contraseña que querés probar

    const admin = await User.scope('withPassword').findOne({ where: { email: emailAdmin } });

    if (!admin) {
      console.log('❌ No se encontró el usuario admin');
      process.exit(1);
    }

    const coincide = await bcrypt.compare(passwordIngresada, admin.password);

    if (coincide) {
      console.log('✔ La contraseña coincide con el hash guardado en DB');
    } else {
      console.log('❌ La contraseña NO coincide con el hash guardado en DB');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error verificando contraseña:', error);
    process.exit(1);
  }
}

verificarAdmin();
