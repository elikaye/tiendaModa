const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_123';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '4h';

// Registro de usuario
const registerUser = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const newUser = await User.create({ nombre, email, password });

    const userData = {
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
      rol: newUser.rol
    };

    res.status(201).json({ message: 'Usuario registrado con éxito.', user: userData });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
    }

    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const userData = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    };

    res.json({ message: 'Login exitoso.', user: userData, token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  registerUser,
  loginUser
};
