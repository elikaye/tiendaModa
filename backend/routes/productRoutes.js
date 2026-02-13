
import express from 'express';
import { Product, sequelize } from '../models/index.js';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/authMiddleware.js';
import multer from 'multer';
import cloudinary from '../cloudinaryConfig.js';
import { Op } from 'sequelize';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// --- Validaciones ---
const validateProduct = [
  body('nombre').trim().isLength({ min: 2 }).withMessage('Nombre inválido (mín 2 caracteres)'),
  body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
  body('categoria').trim().isLength({ min: 2 }).withMessage('Categoría inválida'),
  body('estado').optional().isIn(['activo','inactivo','agotado']).withMessage('Estado inválido'),
  body('destacados').optional().isBoolean().withMessage('Destacados debe ser booleano'),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
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

// --- GET productos con filtros ---
router.get('/', async (req, res) => {
  try {
    const { page, limit, search, categoria, destacados } = req.query;
    const whereClause = {};

    if (categoria) whereClause.categoria = categoria;
    if (destacados === 'true') whereClause.destacados = true;

    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      whereClause[Op.or] = [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('nombre')), { [Op.like]: searchLower }),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('descripcion')), { [Op.like]: searchLower }),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('categoria')), { [Op.like]: searchLower }),
      ];
    }

    const queryOptions = { where: whereClause, order: [['createdAt','DESC']] };
    if(page && limit) {
      queryOptions.limit = parseInt(limit);
      queryOptions.offset = (parseInt(page)-1) * parseInt(limit);
      const result = await Product.findAndCountAll(queryOptions);
      return res.json({
        products: result.rows,
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.count / parseInt(limit)),
        totalProducts: result.count
      });
    }

    const result = await Product.findAll(queryOptions);
    res.json({ products: result, totalProducts: result.length });

  } catch (error) {
    console.error('🔥 Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// --- GET producto por ID ---
router.get('/:id', loadProduct, (req,res) => res.json(req.product));

// --- POST crear producto ---
router.post('/', authenticate, upload.single('image'), validateProduct, async (req,res)=>{
  try {
    let imageUrl = req.body.imageUrl || null;
    if(req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'productos' });
      imageUrl = result.secure_url;
    }

    const precioFloat = parseFloat(req.body.precio.toString().replace(/\./g,'').replace(',','.'));

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
    res.status(500).json({ message:'Error al crear producto' });
  }
});

// --- PUT actualizar producto ---
router.put('/:id', authenticate, upload.single('image'), loadProduct, validateProduct, async (req,res)=>{
  try {
    let imageUrl = req.body.imageUrl || req.product.imageUrl || null;
    if(req.file){
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'productos' });
      imageUrl = result.secure_url;
    }

    const precioFloat = parseFloat(req.body.precio.toString().replace(/\./g,'').replace(',','.'));

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
    res.status(400).json({ message:'Error al actualizar producto' });
  }
});

// --- DELETE producto ---
router.delete('/:id', authenticate, loadProduct, async (req,res)=>{
  try {
    await req.product.destroy();
    res.json({ message:'Producto eliminado correctamente' });
  } catch(error){
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({ message:'Error al eliminar producto' });
  }
});

export default router;
