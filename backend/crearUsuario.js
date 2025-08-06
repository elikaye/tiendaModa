const bcrypt = require('bcryptjs');
const sequelize = require('./config/database'); // Ajustá la ruta si es necesario
const User = require('./models/user'); // Ajustá la ruta si es necesario

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos.');

    const passwordPlain = 'test1234'; // Contraseña para el usuario inicial
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);

    const nuevoUsuario = await User.create({
      nombre: 'Admin Inicial',
      email: 'admin@tuapp.com',
      password: passwordHash,
      rol: 'admin'  // puede ser 'cliente' o 'admin'
    });

    console.log('Usuario creado:', nuevoUsuario.toJSON());
    process.exit(0);
  } catch (error) {
    console.error('Error creando usuario:', error);
    process.exit(1);
  }
})();
