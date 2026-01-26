const express = require('express');
const router = express.Router();
const { obtenerCategorias, obtenerProductos, crearProducto, actualizarProducto, desactivarProducto, activarProducto, eliminarProducto } = require('../controladores/productos.js');
const { verificarToken } = require('../middleware/autenticacion.js');
const middlewareAudit = require('../middleware/auditoria.js');

// Rutas públicas
router.get('/categorias', obtenerCategorias);
router.get('/', obtenerProductos);

// Rutas protegidas
router.post('/', verificarToken, middlewareAudit, crearProducto);
router.put('/:codproducto', verificarToken, middlewareAudit, actualizarProducto);
router.put('/:codproducto/desactivar', verificarToken, middlewareAudit, desactivarProducto);
router.put('/:codproducto/activar', verificarToken, middlewareAudit, activarProducto);
router.delete('/:codproducto', verificarToken, middlewareAudit, eliminarProducto);

module.exports = router;
