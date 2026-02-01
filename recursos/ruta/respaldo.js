const express = require('express');
const router = express.Router();
const { crearRespaldo, restaurarRespaldo, listarRespaldos } = require('../controladores/respaldo.js');
const { verificarToken } = require('../middleware/autenticacion.js');

/**
 * GET /api/respaldo
 * Crea y descarga una copia de seguridad de la base de datos
 * Requiere autenticación y ser administrador
 */
router.get('/', verificarToken, crearRespaldo);

/**
 * GET /api/respaldo/listar
 * Lista todos los respaldos disponibles
 * Requiere autenticación y ser administrador
 */
router.get('/listar', verificarToken, listarRespaldos);

/**
 * POST /api/respaldo/restaurar
 * Restaura la base de datos desde un archivo de respaldo
 * Body: { nombreArchivo: "nombre-del-archivo.sql" }
 * Requiere autenticación y ser administrador
 */
router.post('/restaurar', verificarToken, restaurarRespaldo);

module.exports = router;
