import express from 'express'
import { Product } from '../models/product.js'  // Importa el modelo

const router = express.Router()

// Obtener todos los productos
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' })
  }
})

// Obtener un producto por id
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: 'Producto no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto' })
  }
})

// Crear producto
router.post('/', async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body
    const product = await Product.create({ name, description, price, imageUrl })
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error })
  }
})


// Actualizar un producto
router.put('/products/:id', async (req, res) => {
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
    res.status(400).json({ message: 'Error al actualizar producto' })
  }
})

// Eliminar un producto
router.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id }
    })
    if (deleted) {
      res.json({ message: 'Producto eliminado' })
    } else {
      res.status(404).json({ message: 'Producto no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto' })
  }
})

export default router
