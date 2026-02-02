const express = require('express');
const router = express.Router();
const { obtenerCategorias, obtenerProductos, crearProducto, actualizarProducto, desactivarProducto, activarProducto, eliminarProducto } = require('../controladores/productos.js');
const { verificarToken } = require('../middleware/autenticacion.js');

// Rutas públicas
router.get('/categorias', obtenerCategorias);
router.get('/', (req, res, next) => {
    console.log('[RUTA PRODUCTOS GET] Solicitud recibida, query:', req.query);
    obtenerProductos(req, res);
});

// Rutas protegidas
router.post('/', verificarToken, crearProducto);
router.put('/:codproducto', verificarToken, actualizarProducto);
router.put('/:codproducto/desactivar', verificarToken, desactivarProducto);
router.put('/:codproducto/activar', verificarToken, activarProducto);
router.delete('/:codproducto', verificarToken, eliminarProducto);

module.exports = router;
