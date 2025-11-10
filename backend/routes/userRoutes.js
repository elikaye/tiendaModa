import express from 'express';
import jwt from 'jsonwebtoken';
import { registrarUsuario, loginUsuario } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

// Token de prueba admin
router.get('/token-test', (req, res) => {
  const payload = { id: 1, rol: 'admin' };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto123', { expiresIn: '1h' });
  res.json({ token });
});

export default router;
