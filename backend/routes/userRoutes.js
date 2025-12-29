
import express from 'express';
import jwt from 'jsonwebtoken';
import {
  registrarUsuario,
  loginUsuario,
  getUsuarios,
  updateUsuario,
  deleteUsuario
} from '../controllers/userController.js';

const router = express.Router();

// Auth
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

// Admin usuarios
router.get('/', getUsuarios);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

// Token test
router.get('/token-test', (req, res) => {
  const payload = { id: 1, rol: 'admin' };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto123', { expiresIn: '1h' });
  res.json({ token });
});

export default router;
