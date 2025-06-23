import express from 'express'
import { Product } from '../models/product.js'

const router = express.Router()

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message })
  }
})

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: 'Producto no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message })
  }
})

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, precio } = req.body
    if (!nombre || !precio) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: nombre y precio' })
    }

    const newProduct = await Product.create(req.body)
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message })
  }
})

// Actualizar un producto existente
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id }
    })

    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id)
      res.json(updatedProduct)
    } else {
      res.status(404).json({ message: 'Producto no encontrado' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar producto', error: error.message })
  }
})

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id }
    })

    if (deleted) {
      res.json({ message: 'Producto eliminado correctamente' })
    } else {
      res.status(404).json({ message: 'Producto no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message })
  }
})

export default router
