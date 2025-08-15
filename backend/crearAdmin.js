require('dotenv').config();
const sequelize = require('./config/database'); // ajustá la ruta
const User = require('./models/user'); // ajustá la ruta

async function crearUsuarioAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✔ Conectado a la base de datos');

    const nombre = 'Nombre Cliente';
    const email = 'barbytienda30@gmail.com';
    const passwordPlain = 'InduBarbie#2025'; // texto plano
    const rol = 'admin';

    let user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      console.log('> No existe, creando admin...');
      user = await User.create({
        nombre,
        email,
        password: passwordPlain, // TEXTO PLANO
        rol,
      });
      console.log(`✔ Admin creado: ${user.email}`);
    } else {
      console.log('> Usuario ya existe, actualizando...');
      await user.update({
        nombre,
        password: passwordPlain, // TEXTO PLANO
        rol,
      });
      console.log(`✔ Admin actualizado: ${user.email}`);
    }

    console.log(`Contraseña usada: ${passwordPlain}`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    process.exit(1); 
  }
}