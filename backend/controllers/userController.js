
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// ==================== REGISTRO ====================
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Email inválido' });
    }

    const existeUsuario = await User.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ success: false, message: 'Email ya registrado' });
    }

    // ⚡ No hasheamos acá, lo hace el hook beforeCreate en el modelo
    const nuevoUsuario = await User.create({
      nombre,
      email,
      password,
      rol: 'cliente'
    });

    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado',
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      },
      token
    });

  } catch (error) {
    console.error('❌ registrarUsuario:', error);
    return res.status(500).json({ success: false, message: 'Error servidor', error: error.message });
  }
};

// ==================== LOGIN ====================
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y password requeridos' });
    }

    const usuario = await User.scope('withPassword').findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // Usamos el método comparePassword del modelo
    const passwordOk = await usuario.comparePassword(password);
    if (!passwordOk) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    const usuarioSinPassword = usuario.get();
    delete usuarioSinPassword.password;

    return res.json({
      success: true,
      message: 'Login exitoso',
      user: usuarioSinPassword,
      token
    });

  } catch (error) {
    console.error('❌ loginUsuario:', error);
    return res.status(500).json({ success: false, message: 'Error servidor', error: error.message });
  }
};

module.exports = { registrarUsuario, loginUsuario };
