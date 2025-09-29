const express = require('express');
const Product = require('../models/product'); 
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const cloudinary = require('../cloudinaryConfig');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// --- Validaciones ---
const validateProduct = [
  body('nombre').trim().isLength({ min: 2 }).withMessage('Nombre inválido (mín 2 caracteres)'),
  body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
  body('categoria').trim().isLength({ min: 2 }).withMessage('Categoría inválida'),
  body('estado').optional().isIn(['activo', 'inactivo', 'agotado']).withMessage('Estado inválido'),
  body('destacados').optional().isBoolean().withMessage('Destacados debe ser booleano'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

// --- Middleware para cargar producto por ID ---
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

// --- GET todos los productos con búsqueda y paginación ---
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const whereClause = {};
    if (req.query.categoria) whereClause.categoria = req.query.categoria;
    if (req.query.subcategoria) whereClause.subcategoria = req.query.subcategoria;
    if (req.query.destacados === 'true') whereClause.destacados = true;

    // Búsqueda en nombre, descripción y categoría
    if (search) {
      const { Op } = require('sequelize');
      whereClause[Op.or] = [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { descripcion: { [Op.iLike]: `%${search}%` } },
        { categoria: { [Op.iLike]: `%${search}%` } },
      ];
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
    console.error('🔥 Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// --- GET producto por ID ---
router.get('/:id', loadProduct, (req, res) => {
  res.json(req.product);
});

// --- POST crear producto ---
router.post('/', authMiddleware, upload.single('image'), validateProduct, async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl || null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'productos' });
      imageUrl = result.secure_url;
    }

    const precioFloat = parseFloat(req.body.precio.toString().replace(/\./g,'').replace(',', '.'));

    const newProduct = await Product.create({
      nombre: req.body.nombre,
      precio: precioFloat,
      descripcion: req.body.descripcion || null,
      categoria: req.body.categoria,
      subcategoria: req.body.subcategoria || null,
      talles: req.body.talles || null,
      colores: req.body.colores || null,
      medidas: req.body.medidas || null,
      destacados: req.body.destacados || false,
      estado: req.body.estado || 'activo',
      imageUrl
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

// --- PUT actualizar producto ---
router.put('/:id', authMiddleware, upload.single('image'), loadProduct, validateProduct, async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl || req.product.imageUrl || null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'productos' });
      imageUrl = result.secure_url;
    }

    const precioFloat = parseFloat(req.body.precio.toString().replace(/\./g,'').replace(',', '.'));

    await req.product.update({
      nombre: req.body.nombre,
      precio: precioFloat,
      descripcion: req.body.descripcion || null,
      categoria: req.body.categoria,
      subcategoria: req.body.subcategoria || null,
      talles: req.body.talles || null,
      colores: req.body.colores || null,
      medidas: req.body.medidas || null,
      destacados: req.body.destacados || false,
      estado: req.body.estado || 'activo',
      imageUrl
    });

    res.json(req.product);
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    res.status(400).json({ message: 'Error al actualizar producto' });
  }
});

// --- DELETE eliminar producto ---
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
