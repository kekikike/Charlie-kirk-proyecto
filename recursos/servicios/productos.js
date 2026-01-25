/**
 * Servicios de Productos - Lógica de negocio para gestión de productos
 */

const db = require('../config/conexion.js');

/**
 * Obtiene lista de categorías
 * @param {Function} callback - Callback(err, categorias)
 */
const obtenerCategorias = (callback) => {
    const query = 'SELECT idcategoria, nombre, descripcion, estado FROM tcategorias WHERE estado = 1 ORDER BY nombre ASC';
    
    db.query(query, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results || []);
    });
};

/**
 * Obtiene lista de todos los productos
 * @param {Function} callback - Callback(err, productos)
 */
const obtenerProductos = (callback) => {
    const query = `
        SELECT 
            tp.codproducto, tp.nombre, tp.preciounitario, 
            CAST(tp.estado AS UNSIGNED) as estado,
            tc.idcategoria, tc.nombre as categoria,
            COALESCE(SUM(ti.stock), 0) as stockTotal
        FROM tproductos tp
        LEFT JOIN tcategorias tc ON tp.idcategoria = tc.idcategoria
        LEFT JOIN tinventario ti ON tp.codproducto = ti.codproducto
        GROUP BY tp.codproducto, tp.nombre, tp.preciounitario, tp.estado, tc.idcategoria, tc.nombre
        ORDER BY tp.nombre ASC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('[OBTENER PRODUCTOS] Error:', err.message);
            return callback(err, null);
        }
        console.log('[OBTENER PRODUCTOS] Resultados:', JSON.stringify(results, null, 2));
        callback(null, results || []);
    });
};

/**
 * Obtiene detalles de un producto específico
 * @param {string} codproducto - Código del producto
 * @param {Function} callback - Callback(err, producto)
 */
const obtenerProductoPorCodigo = (codproducto, callback) => {
    const query = `
        SELECT 
            tp.codproducto, tp.nombre, tp.preciounitario, tp.estado,
            tc.idcategoria, tc.nombre as categoria,
            COALESCE(SUM(ti.stock), 0) as stockTotal
        FROM tproductos tp
        LEFT JOIN tcategorias tc ON tp.idcategoria = tc.idcategoria
        LEFT JOIN tinventario ti ON tp.codproducto = ti.codproducto
        WHERE tp.codproducto = ?
        GROUP BY tp.codproducto
    `;
    
    db.query(query, [codproducto], (err, results) => {
        if (err) return callback(err, null);
        const producto = results.length > 0 ? results[0] : null;
        callback(null, producto);
    });
};

/**
 * Crea un nuevo producto
 * @param {Object} datos - Datos del producto
 * @param {Function} callback - Callback(err, resultado)
 */
const crearProducto = (datos, callback) => {
    const { codproducto, nombre, idcategoria, preciounitario, usuarioA } = datos;
    
    const query = `
        INSERT INTO tproductos (codproducto, nombre, idcategoria, preciounitario, estado, usuarioA)
        VALUES (?, ?, ?, ?, 1, ?)
    `;
    
    db.query(query, [codproducto, nombre, idcategoria, preciounitario, usuarioA], (err, results) => {
        if (err) return callback(err, null);
        callback(null, { codproducto, nombre, preciounitario });
    });
};

/**
 * Actualiza un producto
 * @param {string} codproducto - Código del producto
 * @param {Object} datos - Datos a actualizar
 * @param {Function} callback - Callback(err, resultado)
 */
const actualizarProducto = (codproducto, datos, callback) => {
    const { nombre, idcategoria, preciounitario } = datos;
    
    const query = `
        UPDATE tproductos 
        SET nombre = ?, idcategoria = ?, preciounitario = ?
        WHERE codproducto = ?
    `;
    
    db.query(query, [nombre, idcategoria, preciounitario, codproducto], (err, results) => {
        if (err) return callback(err, null);
        if (results.affectedRows === 0) {
            return callback(new Error('Producto no encontrado'), null);
        }
        callback(null, { codproducto, nombre, preciounitario });
    });
};

/**
 * Desactiva un producto
 * @param {string} codproducto - Código del producto
 * @param {Function} callback - Callback(err, resultado)
 */
const desactivarProducto = (codproducto, callback) => {
    const query = 'UPDATE tproductos SET estado = 0 WHERE codproducto = ?';
    
    db.query(query, [codproducto], (err, results) => {
        if (err) return callback(err, null);
        if (results.affectedRows === 0) {
            return callback(new Error('Producto no encontrado'), null);
        }
        callback(null, { codproducto, estado: 0 });
    });
};

/**
 * Activa un producto
 * @param {string} codproducto - Código del producto
 * @param {Function} callback - Callback(err, resultado)
 */
const activarProducto = (codproducto, callback) => {
    const query = 'UPDATE tproductos SET estado = 1 WHERE codproducto = ?';
    console.log(`[ACTIVAR] Ejecutando query: ${query} con codproducto: ${codproducto}`);
    
    db.query(query, [codproducto], (err, results) => {
        if (err) {
            console.error(`[ACTIVAR] Error: ${err.message}`);
            return callback(err, null);
        }
        console.log(`[ACTIVAR] Resultado: affectedRows=${results.affectedRows}`);
        if (results.affectedRows === 0) {
            return callback(new Error('Producto no encontrado'), null);
        }
        callback(null, { codproducto, estado: 1 });
    });
};

/**
 * Obtiene el próximo código de producto
 * @param {Function} callback - Callback(err, nuevoCodiogo)
 */
const obtenerProximoCodigoProducto = (callback) => {
    const query = "SELECT COUNT(*) as total FROM tproductos";
    
    db.query(query, (err, results) => {
        if (err) return callback(err, null);
        const nuevoId = (results[0].total + 1).toString().padStart(3, '0');
        const codigoProducto = `PROD${nuevoId}`;
        callback(null, codigoProducto);
    });
};

/**
 * Elimina un producto
 * @param {string} codproducto - Código del producto
 * @param {Function} callback - Callback(err, resultado)
 */
const eliminarProducto = (codproducto, callback) => {
    const query = 'DELETE FROM tproductos WHERE codproducto = ?';
    
    db.query(query, [codproducto], (err, results) => {
        if (err) return callback(err, null);
        if (results.affectedRows === 0) {
            return callback(new Error('Producto no encontrado'), null);
        }
        callback(null, { codproducto, eliminado: true });
    });
};

module.exports = {
    obtenerCategorias,
    obtenerProductos,
    obtenerProductoPorCodigo,
    crearProducto,
    actualizarProducto,
    desactivarProducto,
    activarProducto,
    obtenerProximoCodigoProducto,
    eliminarProducto
};
