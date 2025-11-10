// backend/routes/favoritosRoutes.js
import express from 'express';
import {
  getFavoritos,
  addFavorito,
  removeFavorito,
  clearFavoritos,
} from '../controllers/favoritosController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Asegurarse de que el body se lea correctamente como JSON
router.use(express.json());

// Todas las rutas de favoritos requieren autenticación
router.use(authenticate);

// Obtener todos los favoritos
router.get('/', getFavoritos);

// Agregar un producto a favoritos
router.post('/', addFavorito);

// Eliminar un producto específico
router.delete('/', removeFavorito);

// Vaciar toda la lista de favoritos
router.delete('/clear', clearFavoritos);

export default router;
