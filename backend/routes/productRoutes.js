const express = require('express');
const { Product } = require('../models/product');
const { validationResult, body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware'); // 👈 corregido


const router = express.Router();

// Middleware de validación reusable
const validateProduct = [
  body('nombre').trim().isLength({ min: 2 }).withMessage('Nombre inválido (mín 2 caracteres)'),
  body('precio').isFloat({ gt: 0 }).withMessage('Precio debe ser mayor a 0'),
  body('descripcion').optional().trim(),
  body('subcategoria').optional().isLength({ min: 2, max: 50 }).withMessage('Subcategoría inválida'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Middleware para cargar producto por ID
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

// Obtener productos con filtros opcionales: categoría, destacados, paginado
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (req.query.categoria) {
      whereClause.categoria = req.query.categoria;
    }

    if (req.query.subcategoria) {
      whereClause.subcategoria = req.query.subcategoria;
    }

    if (req.query.destacados === 'true') {
      whereClause.destacados = true;
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    console.error('🔥 Error en GET /api/v1/products:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Obtener producto por ID
router.get('/:id', loadProduct, (req, res) => {
  res.json(req.product);
});

// Crear nuevo producto - PROTEGIDO
router.post('/', authMiddleware, validateProduct, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

// Actualizar producto - PROTEGIDO
router.put('/:id', authMiddleware, loadProduct, validateProduct, async (req, res) => {
  try {
    await req.product.update(req.body);
    res.json(req.product);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar producto' });
  }
});

// Eliminar producto - PROTEGIDO
router.delete('/:id', authMiddleware, loadProduct, async (req, res) => {
  try {
    await req.product.destroy();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
});

module.exports = router;
