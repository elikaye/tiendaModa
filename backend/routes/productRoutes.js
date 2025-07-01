import express from 'express';
import { Product } from '../models/product.js';
import { validationResult, body } from 'express-validator'; // Nueva dependencia

const router = express.Router();

// Middleware de validación reusable
const validateProduct = [
  body('nombre').trim().isLength({ min: 2 }).withMessage('Nombre inválido (mín 2 caracteres)'),
  body('precio').isFloat({ gt: 0 }).withMessage('Precio debe ser mayor a 0'),
  body('descripcion').optional().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Middleware para cargar producto
const loadProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    req.product = product;
    next();
  } catch (error) {
   console.error('❌ Error detallado:', error);
res.status(500).json({ message: 'Error al obtener productos', error: error.message });

  }
};

// Obtener productos paginados
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset
    });

    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    console.error('🔥 Error en GET /api/v1/products:', error); // 👈 Agregado
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});


// Obtener producto por ID
router.get('/:id', loadProduct, (req, res) => {
  res.json(req.product);
});

// Crear nuevo producto
router.post('/', validateProduct, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

// Actualizar producto
router.put('/:id', loadProduct, validateProduct, async (req, res) => {
  try {
    // Actualización directa sin segunda consulta
    await req.product.update(req.body);
    res.json(req.product);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar producto' });
  }
});

// Eliminar producto
router.delete('/:id', loadProduct, async (req, res) => {
  try {
    await req.product.destroy();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
});

export default router;