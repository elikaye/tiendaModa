const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existeUsuario = await User.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ message: 'Este email ya está registrado' });
    }

    // No hashear aquí, el modelo lo hace con hooks
    const nuevoUsuario = await User.create({ nombre, email, password });

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('❌ Error en /register:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Traer password explícitamente
    const usuario = await User.scope('withPassword').findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '4h' }
    );

    res.json({
      message: 'Login exitoso',
      user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      token
    });
  } catch (error) {
    console.error('❌ Error en /login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
