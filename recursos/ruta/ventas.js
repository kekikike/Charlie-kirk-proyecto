const express = require('express');
const router = express.Router();
const { crearVenta, obtenerVentas, obtenerDetallesVenta, obtenerMetodosPago } = require('../controladores/ventas.js');
const { verificarToken } = require('../middleware/autenticacion.js');
const middlewareAudit = require('../middleware/auditoria.js');

// Rutas públicas
router.get('/metodos', obtenerMetodosPago);

// Rutas protegidas
router.post('/', verificarToken, middlewareAudit, crearVenta);

module.exports = router;