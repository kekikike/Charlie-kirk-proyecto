const express = require('express');
const router = express.Router();
const { obtenerHistorial } = require('../controladores/auditlogs.js');
const { verificarToken } = require('../middleware/autenticacion.js');
const { soloAdmin } = require('../middleware/autorizacion.js');

// Rutas protegidas - Solo administrador
router.get('/', verificarToken, soloAdmin, obtenerHistorial);

module.exports = router;
