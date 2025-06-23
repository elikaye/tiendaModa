import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { Sequelize } from 'sequelize'
import productRoutes from './routes/productRoutes.js' // Importar rutas

const app = express()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: 3306,
  logging: false,
})

sequelize.authenticate()
  .then(() => {
    console.log('DB connected ✅')
    return sequelize.sync({ alter: true }) // sincroniza tablas
  })
  .then(() => console.log('Modelos sincronizados ✅'))
  .catch(err => console.error('DB connection error ❌', err))

app.use(cors())
app.use(express.json())

app.use('/images', express.static('public/images'));

// Cambiamos la ruta base para que no se repita 'products' dos veces
app.use('/api/products', productRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
