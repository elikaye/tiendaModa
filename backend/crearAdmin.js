// scripts/crearAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database'); // ajustá la ruta si hace falta
const User = require('./models/user'); // ajustá la ruta si hace falta

async function crearUsuarioAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✔ Conectado a la base de datos');

    const nombre = 'Nombre Cliente';
    const email = 'barbytienda30@gmail.com';
    const passwordPlain = 'InduBarbie#2025';
    const rol = 'admin';

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(passwordPlain, 10);

    // Si ya existe un admin con ese email → lo borro
    const existente = await User.scope('withPassword').findOne({ where: { email } });
    if (existente) {
      console.log(`> Admin existente encontrado (${email}), eliminando...`);
      await existente.destroy();
    }

    // Crear admin de cero
    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol,
    });

    console.log(`✔ Admin creado correctamente: ${user.email}`);
    console.log(`   Contraseña original (para login): ${passwordPlain}`);
    console.log(`   Rol: ${user.rol}`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error creando usuario admin:', error);
    process.exit(1);
  }
}

crearUsuarioAdmin();
