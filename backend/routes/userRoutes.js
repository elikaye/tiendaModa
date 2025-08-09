// userRoutes.js

const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario } = require('../controllers/userController');

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);  // CAMBIO AQUÍ

module.exports = router;
