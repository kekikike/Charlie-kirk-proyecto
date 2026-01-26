const express = require('express');
const router = express.Router();
const { registrarUsuario, login, obtenerPerfil, obtenerEmpleados, actualizarEstadoEmpleado, eliminarEmpleado } = require('../controladores/autenticacion.js');
const { verificarToken } = require('../middleware/autenticacion.js');

// Rutas públicas
router.post('/login', login);

// Rutas protegidas (requieren autenticación)
router.post('/registro', verificarToken, registrarUsuario);
router.get('/perfil', verificarToken, obtenerPerfil);

// Rutas de empleados (protegidas)
router.get('/empleados', verificarToken, obtenerEmpleados);
router.put('/empleados/:id/estado', verificarToken, actualizarEstadoEmpleado);
router.delete('/empleados/:id', verificarToken, eliminarEmpleado);
module.exports = router;