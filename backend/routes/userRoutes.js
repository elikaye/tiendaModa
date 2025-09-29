// userRoutes.js
const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario } = require('../controllers/userController');
const jwt = require('jsonwebtoken');

// Endpoints existentes
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

// Endpoint temporal para generar token de admin
router.get('/token-test', (req, res) => {
  const payload = {
    id: 1,       // id del usuario admin
    rol: 'admin' // rol admin
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto123', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
