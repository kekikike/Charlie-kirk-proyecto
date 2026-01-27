const express = require('express');
const router = express.Router();
const { crearCliente, obtenerClientes, obtenerClientePorId, actualizarCliente, eliminarCliente } = require('../controladores/clientes.js');
const { verificarToken } = require('../middleware/autenticacion.js');

// Rutas protegidas
router.post('/', verificarToken, crearCliente);
router.get('/', verificarToken, obtenerClientes);
router.get('/:id', verificarToken, obtenerClientePorId);
router.put('/:id', verificarToken, actualizarCliente);
router.delete('/:id', verificarToken, eliminarCliente);

module.exports = router;
