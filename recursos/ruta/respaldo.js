const express = require('express');
const router = express.Router();
const { crearRespaldo } = require('../controladores/respaldo.js');
const { verificarToken } = require('../middleware/autenticacion.js');

/**
 * GET /api/respaldo
 * Crea y descarga una copia de seguridad de la base de datos
 * Requiere autenticación y ser administrador
 */
router.get('/', verificarToken, crearRespaldo);

module.exports = router;
