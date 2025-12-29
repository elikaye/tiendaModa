import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// ==================== REGISTRO ====================
export const registrarUsuario = async (req, res) => {
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
        message: 'Email inválido',
      });
    }

    const existeUsuario = await User.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({
        success: false,
        message: 'Email ya registrado',
      });
    }

    // ⚡ El password se hashea en el hook del modelo
    const nuevoUsuario = await User.create({
      nombre,
      email,
      password,
      rol: 'cliente',
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
        rol: nuevoUsuario.rol,
      },
      token,
    });
  } catch (error) {
    console.error('❌ registrarUsuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error servidor',
    });
  }
};

// ==================== LOGIN ====================
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password requeridos',
      });
    }

    const usuario = await User.scope('withPassword').findOne({
      where: { email },
    });

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

    const usuarioSinPassword = usuario.get();
    delete usuarioSinPassword.password;

    return res.json({
      success: true,
      message: 'Login exitoso',
      user: usuarioSinPassword,
      token,
    });
  } catch (error) {
    console.error('❌ loginUsuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error servidor',
    });
  }
};

// ==================== ADMIN - LISTAR USUARIOS ====================
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: { exclude: ['password'] },
      paranoid: true,
      order: [['createdAt', 'DESC']],
    });

    return res.json(usuarios);
  } catch (error) {
    console.error('❌ getUsuarios:', error);
    return res.status(500).json({
      message: 'Error al obtener usuarios',
    });
  }
};

// ==================== ADMIN - ACTUALIZAR USUARIO ====================
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, password } = req.body;

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      });
    }

    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (rol) usuario.rol = rol;
    if (password) usuario.password = password; // hook lo hashea

    await usuario.save();

    const usuarioSeguro = usuario.get();
    delete usuarioSeguro.password;

    return res.json(usuarioSeguro);
  } catch (error) {
    console.error('❌ updateUsuario:', error);
    return res.status(500).json({
      message: 'Error al actualizar usuario',
    });
  }
};

// ==================== ADMIN - ELIMINAR USUARIO ====================
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      });
    }

    // Soft delete
    await usuario.destroy();

    return res.json({
      message: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    console.error('❌ deleteUsuario:', error);
    return res.status(500).json({
      message: 'Error al eliminar usuario',
    });
  }
};
