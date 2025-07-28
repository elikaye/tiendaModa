
const express = require('express');
const Product = require('../models/product');  // Importación CORRECTA sin destructuring
const { validationResult, body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validación del producto
const validateProduct = [
  body('name').trim().isLength({ min: 2 }).withMessage('Nombre inválido (mín 2 caracteres)'),
  body('price').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
  body('description').optional().trim(),
  body('subcategoria').optional().isLength({ min: 2, max: 50 }).withMessage('Subcategoría inválida'),
  body('categoria').trim().isLength({ min: 2, max: 50 }).withMessage('Categoría inválida'),
  body('imageUrl').optional().trim(),
  body('estado').optional().isIn(['activo', 'inactivo', 'agotado']).withMessage('Estado inválido'),
  body('destacados').optional().isBoolean().withMessage('Destacados debe ser booleano'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
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
    console.error('❌ Error al buscar producto por ID:', error);
    res.status(500).json({ message: 'Error interno' });
  }
};

// Obtener productos (filtros opcionales)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (req.query.categoria) whereClause.categoria = req.query.categoria;
    if (req.query.subcategoria) whereClause.subcategoria = req.query.subcategoria;
    if (req.query.destacados === 'true') whereClause.destacados = true;

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

      console.log('✅ Productos encontrados:', products);

    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    console.error('🔥 Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Obtener producto por ID
router.get('/:id', loadProduct, (req, res) => {
  res.json(req.product);
});

// Crear producto - PROTEGIDO
router.post('/', authMiddleware, validateProduct, async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      subcategoria,
      categoria,
      imageUrl,
      estado,
      destacados
    } = req.body;

    const newProduct = await Product.create({
      name,
      price,
      description,
      subcategoria,
      categoria,
      imageUrl,
      estado,
      destacados
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

// Actualizar producto - PROTEGIDO
router.put('/:id', authMiddleware, loadProduct, validateProduct, async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      subcategoria,
      categoria,
      imageUrl,
      estado,
      destacados
    } = req.body;

    await req.product.update({
      name,
      price,
      description,
      subcategoria,
      categoria,
      imageUrl,
      estado,
      destacados
    });

    res.json(req.product);
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    res.status(400).json({ message: 'Error al actualizar producto' });
  }
});

// Eliminar producto - PROTEGIDO
router.delete('/:id', authMiddleware, loadProduct, async (req, res) => {
  try {
    await req.product.destroy();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
});

module.exports = router;
