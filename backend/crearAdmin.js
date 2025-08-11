const bcrypt = require('bcryptjs');
const User = require('./models/user'); // ajustá la ruta según tu proyecto
const sequelize = require('./config/database'); // para conexión

async function crearUsuarioAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos');

    const nombre = 'Nombre Cliente';  // poné el nombre real de la clienta
    const email = 'barbytienda30@gmail.com'; // el mail que creaste
    const passwordPlain = 'indumentariabarby'; // la contraseña que le pusiste
    const rol = 'admin'; // o 'cliente' según quieras

    // Verificar si el usuario ya existe
    const existeUsuario = await User.findOne({ where: { email } });
    if (existeUsuario) {
      console.log('El usuario ya existe. No se creará uno nuevo.');
      process.exit(0);
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(passwordPlain, salt);

    // Crear el usuario
    const nuevoUsuario = await User.create({
      nombre,
      email,
      password: passwordHasheada,
      rol,
    });

    console.log('Usuario creado correctamente:', nuevoUsuario.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creando usuario:', error);
    process.exit(1);
  }
}

crearUsuarioAdmin();
