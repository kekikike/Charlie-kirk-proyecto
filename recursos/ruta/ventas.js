const express = require('express');
const router = express.Router();
const { crearVenta, obtenerVentas, obtenerDetallesVenta, obtenerMetodosPago, generarTicket} = require('../controladores/ventas.js');
const { verificarToken } = require('../middleware/autenticacion.js');

// Rutas públicas
router.get('/metodos', obtenerMetodosPago);

// Rutas protegidas
router.post('/', verificarToken, crearVenta);
router.get('/', verificarToken, obtenerVentas);
router.get('/:idventa', verificarToken, obtenerDetallesVenta);

// Nueva ruta para el ticket (Protegida)
router.post('/ticket', verificarToken, generarTicket);

module.exports = router;
