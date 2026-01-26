const express = require('express');
const router = express.Router();
const { obtenerInventario, obtenerInventarioPorProducto, crearInventario, actualizarStock, marcarVencido, eliminarInventario } = require('../controladores/inventario.js');
const { verificarToken } = require('../middleware/autenticacion.js');
const { validarInventario } = require('../middleware/validacion.js');
const { soloAdmin } = require('../middleware/autorizacion.js');
const middlewareAudit = require('../middleware/auditoria.js');

// Rutas públicas
router.get('/', obtenerInventario);
router.get('/:codproducto', obtenerInventarioPorProducto);

// Rutas protegidas
router.post('/', verificarToken, soloAdmin, middlewareAudit, validarInventario, crearInventario);
router.put('/:codinventario/stock', verificarToken, soloAdmin, middlewareAudit, actualizarStock);
router.put('/:codinventario/vencido', verificarToken, soloAdmin, middlewareAudit, marcarVencido);
router.delete('/:codinventario', verificarToken, soloAdmin, middlewareAudit, eliminarInventario);

module.exports = router;
