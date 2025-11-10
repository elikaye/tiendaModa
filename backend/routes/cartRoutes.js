
import express from 'express';
import { Cart, User } from '../models/index.js'; // ✅ importa desde el index.js de models
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Obtener carrito de un usuario ---
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const carrito = await Cart.findOne({
      where: { user_id: req.params.userId },
      include: [{ model: User, as: 'cartUsuario', attributes: ['id', 'nombre', 'email'] }],
    });

    if (!carrito) return res.status(404).json({ message: 'Carrito no encontrado' });

    res.json(carrito);
  } catch (error) {
    console.error('❌ Error al obtener carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// --- Crear o actualizar carrito ---
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const productos = req.body.productos || [];

    let carrito = await Cart.findOne({ where: { user_id: userId } });

    if (carrito) {
      carrito.productos = productos;
      await carrito.save();
    } else {
      carrito = await Cart.create({ user_id: userId, productos });
    }

    res.status(201).json(carrito);
  } catch (error) {
    console.error('❌ Error al crear/actualizar carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// --- Vaciar carrito ---
router.delete('/:userId', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;
    const carrito = await Cart.findOne({ where: { user_id: userId } });

    if (!carrito) return res.status(404).json({ message: 'Carrito no encontrado' });

    carrito.productos = [];
    await carrito.save();

    res.json({ message: 'Carrito vaciado correctamente', carrito });
  } catch (error) {
    console.error('❌ Error al vaciar carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
