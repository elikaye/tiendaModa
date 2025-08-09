const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Registrar nuevo usuario - CORREGIDO
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validación mejorada
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Todos los campos son obligatorios' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'El formato del email es inválido' 
      });
    }

    const existeUsuario = await User.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ 
        success: false,
        message: 'Este email ya está registrado' 
      });
    }

    // 🔐 Hashear la contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario usando el modelo - CORRECCIÓN IMPORTANTE
    const nuevoUsuario = await User.create({
      nombre,
      email,
      password: passwordHash,
      rol: 'cliente' // Asegurar el rol por defecto
    });

    // Generar token para registro exitoso
    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET, // Sin valor por defecto - seguridad
      { expiresIn: '4h' }
    );

    return res.status(201).json({ 
      success: true,
      message: 'Usuario registrado correctamente',
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      },
      token
    });
    
  } catch (error) {
    console.error('❌ Error en registrarUsuario:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

// Login de usuario - CORREGIDO
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email y contraseña requeridos' 
      });
    }

    // Usar scope conPassword para obtener hash
    const usuario = await User.scope('withPassword').findOne({ 
      where: { email } 
    });
    
    if (!usuario) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    // Comparar contraseñas
    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    // Generar token con datos seguros
    const token = jwt.sign(
      { 
        id: usuario.id, 
        rol: usuario.rol 
      }, // No incluir email por seguridad
      process.env.JWT_SECRET, // Sin valor por defecto
      { expiresIn: '4h' }
    );

    // Obtener datos de usuario sin contraseña
    const usuarioSinPassword = usuario.get();
    delete usuarioSinPassword.password;

    return res.json({
      success: true,
      message: 'Login exitoso',
      user: usuarioSinPassword,
      token
    });
    
  } catch (error) {
    console.error('❌ Error en loginUsuario:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error en el servidor', 
      error: error.message 
    });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario
};