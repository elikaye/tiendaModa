// controllers/userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// ====================
// Registrar usuario
// ====================
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido',
      });
    }

    const existeUsuario = await User.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({
        success: false,
        message: 'Este email ya está registrado',
      });
    }

    // Crear usuario (hash del password en hook del modelo)
    const nuevoUsuario = await User.create({
      nombre,
      email,
      password,
      rol: 'cliente',
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
      token,
    });
  } catch (error) {
    console.error('❌ Error en registrarUsuario:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor',
    });
  }
};

// ====================
// Login usuario
// ====================
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña requeridos',
      });
    }

    // Traer usuario con password
    const usuario = await User.scope('withPassword').findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const passwordOk = await usuario.comparePassword(password);
    if (!passwordOk) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    // Devolver datos sin password
    const usuarioSinPassword = usuario.get();
    delete usuarioSinPassword.password;

    return res.json({
      success: true,
      message: 'Login exitoso',
      user: usuarioSinPassword,
      token,
    });
  } catch (error) {
    console.error('❌ Error en loginUsuario:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor',
    });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
};
