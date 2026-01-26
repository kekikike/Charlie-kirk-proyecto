const express = require('express');
const router = express.Router();
const { obtenerInventario, obtenerInventarioPorProducto, crearInventario, actualizarStock, marcarVencido, eliminarInventario } = require('../controladores/inventario.js');
const { verificarToken } = require('../middleware/autenticacion.js');

// Rutas públicas
router.get('/', obtenerInventario);
router.get('/:codproducto', obtenerInventarioPorProducto);

// Rutas protegidas
router.post('/', verificarToken, crearInventario);
router.put('/:codinventario/stock', verificarToken, actualizarStock);
router.put('/:codinventario/vencido', verificarToken, marcarVencido);
router.delete('/:codinventario', verificarToken, eliminarInventario);

module.exports = router;
