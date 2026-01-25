/**
 * Servicios de Inventario - Lógica de negocio para gestión de inventario
 */

const db = require('../config/conexion.js');

/**
 * Obtiene lista completa de inventario
 * @param {Function} callback - Callback(err, inventario)
 */
const obtenerInventario = (callback) => {
    const query = `
        SELECT 
            ti.codinventario, ti.codproducto, ti.stock, 
            ti.fechavencimiento, ti.fechaingreso, ti.estadolote, ti.estado,
            tp.nombre as producto, tp.preciounitario,
            tc.nombre as categoria
        FROM tinventario ti
        LEFT JOIN tproductos tp ON ti.codproducto = tp.codproducto
        LEFT JOIN tcategorias tc ON tp.idcategoria = tc.idcategoria
        ORDER BY ti.fechavencimiento ASC
    `;
    
    db.query(query, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results || []);
    });
};

/**
 * Obtiene inventario por producto
 * @param {string} codproducto - Código del producto
 * @param {Function} callback - Callback(err, lotes)
 */
const obtenerInventarioPorProducto = (codproducto, callback) => {
    const query = `
        SELECT 
            ti.codinventario, ti.codproducto, ti.stock, 
            ti.fechavencimiento, ti.fechaingreso, ti.estadolote, ti.estado,
            tp.nombre as producto, tp.preciounitario
        FROM tinventario ti
        LEFT JOIN tproductos tp ON ti.codproducto = tp.codproducto
        WHERE ti.codproducto = ?
        ORDER BY ti.fechavencimiento ASC
    `;
    
    db.query(query, [codproducto], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results || []);
    });
};

/**
 * Crea un nuevo lote de inventario
 * @param {Object} datos - Datos del lote
 * @param {Function} callback - Callback(err, resultado)
 */
const crearInventario = (datos, callback) => {
    const { codinventario, codproducto, stock, fechavencimiento, fechaingreso, usuarioA } = datos;
    
    const query = `
        INSERT INTO tinventario (codinventario, codproducto, stock, fechavencimiento, fechaingreso, estadolote, estado, usuarioA)
        VALUES (?, ?, ?, ?, ?, 1, 1, ?)
    `;
    
    db.query(query, [codinventario, codproducto, stock, fechavencimiento, fechaingreso, usuarioA], 
        (err, results) => {
            if (err) return callback(err, null);
            callback(null, { codinventario, codproducto, stock });
        }
    );
};

/**
 * Actualiza el stock de un lote
 * @param {string} codinventario - Código del lote
 * @param {number} nuevoStock - Nuevo stock
 * @param {Function} callback - Callback(err, resultado)
 */
const actualizarStock = (codinventario, nuevoStock, callback) => {
    const query = 'UPDATE tinventario SET stock = ? WHERE codinventario = ?';
    
    db.query(query, [nuevoStock, codinventario], (err, results) => {
        if (err) return callback(err, null);
        if (results.affectedRows === 0) {
            return callback(new Error('Lote de inventario no encontrado'), null);
        }
        callback(null, { codinventario, stock: nuevoStock });
    });
};

/**
 * Marca un lote como vencido
 * @param {string} codinventario - Código del lote
 * @param {Function} callback - Callback(err, resultado)
 */
const marcarVencido = (codinventario, callback) => {
    const query = 'UPDATE tinventario SET estadolote = 0, estado = 0 WHERE codinventario = ?';
    
    db.query(query, [codinventario], (err, results) => {
        if (err) return callback(err, null);
        if (results.affectedRows === 0) {
            return callback(new Error('Lote de inventario no encontrado'), null);
        }
        callback(null, { codinventario, vencido: true });
    });
};

/**
 * Obtiene el próximo código de inventario
 * @param {Function} callback - Callback(err, nuevoCodiogo)
 */
const obtenerProximoCodigoInventario = (callback) => {
    const query = "SELECT COUNT(*) as total FROM tinventario";
    
    db.query(query, (err, results) => {
        if (err) return callback(err, null);
        const nuevoId = (results[0].total + 1).toString().padStart(5, '0');
        const codigoInventario = `INV${nuevoId}`;
        callback(null, codigoInventario);
    });
};

/**
 * Elimina un lote de inventario
 * @param {string} codinventario - Código del lote
 * @param {Function} callback - Callback(err, resultado)
 */
const eliminarInventario = (codinventario, callback) => {
    const query = 'DELETE FROM tinventario WHERE codinventario = ?';
    
    db.query(query, [codinventario], (err, results) => {
        if (err) return callback(err, null);
        if (results.affectedRows === 0) {
            return callback(new Error('Lote de inventario no encontrado'), null);
        }
        callback(null, { codinventario, eliminado: true });
    });
};

/**
 * Cuenta los lotes asociados a un producto
 * @param {string} codproducto - Código del producto
 * @param {Function} callback - Callback(err, cantidad)
 */
const contarLotesProducto = (codproducto, callback) => {
    const query = 'SELECT COUNT(*) as total FROM tinventario WHERE codproducto = ?';
    
    db.query(query, [codproducto], (err, results) => {
        if (err) return callback(err, null);
        const cantidad = results[0].total;
        callback(null, cantidad);
    });
};

module.exports = {
    obtenerInventario,
    obtenerInventarioPorProducto,
    crearInventario,
    actualizarStock,
    marcarVencido,
    obtenerProximoCodigoInventario,
    eliminarInventario,
    contarLotesProducto
};
