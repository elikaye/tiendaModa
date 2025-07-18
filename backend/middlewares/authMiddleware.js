import express from 'express';
import { authMiddleware } from './middlewares/authMiddleware.js'; // ajustá ruta si hace falta

const router = express.Router();

// Ruta pública
router.get('/publica', (req, res) => {
  res.json({ message: 'Esta ruta es pública' });
});

// Ruta protegida, solo accesible con token válido
router.get('/privada', authMiddleware, (req, res) => {
  res.json({ message: `Hola ${req.user.email}, esta ruta es protegida` });
});

export default router;
