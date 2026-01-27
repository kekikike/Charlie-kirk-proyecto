const express = require('express');
const router = express.Router();
const { obtenerCategorias, obtenerProductos, crearProducto, actualizarProducto, desactivarProducto, activarProducto, eliminarProducto } = require('../controladores/productos.js');
const { verificarToken } = require('../middleware/autenticacion.js');

// Rutas públicas
router.get('/categorias', obtenerCategorias);
router.get('/', obtenerProductos);

// Rutas protegidas
router.post('/', verificarToken, crearProducto);
router.put('/:codproducto', verificarToken, actualizarProducto);
router.put('/:codproducto/desactivar', verificarToken, desactivarProducto);
router.put('/:codproducto/activar', verificarToken, activarProducto);
router.delete('/:codproducto', verificarToken, eliminarProducto);

module.exports = router;
