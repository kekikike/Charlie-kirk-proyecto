/**
 * Servicios de Ventas - Lógica de negocio para gestión de ventas
 */

const db = require('../config/conexion.js');

/**
 * Crea una nueva venta
 * @param {Object} datos - Datos de la venta
 * @param {Function} callback - Callback(err, resultado)
 */
const crearVenta = (datos, callback) => {
    const { ciempleado, subtotal, total, idmetodo, ci_nit, detalles } = datos;
    
    const queryVenta = `
        INSERT INTO tventas (ci_nit, ciempleado, subtotal, total, idmetodo, fechaventa, hora, fecharegistro, estado, usuarioA)
        VALUES (?, ?, ?, ?, ?, CURDATE(), CURTIME(), NOW(), 1, ?)
    `;
    
    db.query(queryVenta, [ci_nit || null, ciempleado, subtotal, total, idmetodo, ciempleado], (err, result) => {
        if (err) return callback(err, null);
        
        const idventa = result.insertId;
        
        // Insertar detalles de venta
        let detallesInsertados = 0;
        
        if (detalles.length === 0) {
            return callback(null, { idventa, total, detallesInsertados: 0 });
        }
        
        detalles.forEach((detalle) => {
            const queryDetalle = `
                INSERT INTO tdetalleventa (idventa, codproducto, cantidad, preciounitario, subtotal, estado, usuarioA)
                VALUES (?, ?, ?, ?, ?, 1, ?)
            `;
            
            db.query(
                queryDetalle,
                [idventa, detalle.codproducto, detalle.cantidad, detalle.preciounitario, detalle.subtotal, ciempleado],
                (err) => {
                    if (err) {
                        console.error('[DETALLE] Error insertando detalle:', err.message);
                        // Continuar aunque haya error en un detalle
                    }
                    
                    detallesInsertados++;
                    
                    // Cuando todos los detalles estén procesados, retornar
                    if (detallesInsertados === detalles.length) {
                        callback(null, { idventa, total, detallesInsertados });
                    }
                }
            );
        });
    });
};

/**
 * Obtiene lista de ventas
 * @param {Function} callback - Callback(err, ventas)
 */
const obtenerVentas = (callback) => {
    const query = `
        SELECT 
            tv.idventa, tv.ciempleado, tv.subtotal, tv.total,
            tv.idmetodo, tm.nombre as metodo, tv.fecharegistro, tv.estado,
            te.nombre1, te.apellido1,
            COUNT(DISTINCT tdv.iddetalle) as cantidad_productos
        FROM tventas tv
        LEFT JOIN tmetodopago tm ON tv.idmetodo = tm.idmetodo
        LEFT JOIN templeados te ON tv.ciempleado = te.ciempleado
        LEFT JOIN tdetalleventa tdv ON tv.idventa = tdv.idventa
        GROUP BY tv.idventa, tv.ciempleado, tv.subtotal, tv.total, 
                 tv.idmetodo, tm.nombre, tv.fecharegistro, tv.estado, te.nombre1, te.apellido1
        ORDER BY tv.fecharegistro DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results || []);
    });
};

/**
 * Obtiene detalles de una venta específica
 * @param {number} idventa - ID de la venta
 * @param {Function} callback - Callback(err, detalles)
 */
const obtenerDetallesVenta = (idventa, callback) => {
    const query = `
        SELECT 
            tdv.idventa, tdv.codproducto, tdv.cantidad, tdv.preciounitario, tdv.subtotal,
            tp.nombre as nombre_producto
        FROM tdetalleventa tdv
        LEFT JOIN tproductos tp ON tdv.codproducto = tp.codproducto
        WHERE tdv.idventa = ?
        ORDER BY tdv.codproducto ASC
    `;
    
    db.query(query, [idventa], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results || []);
    });
};

/**
 * Obtiene métodos de pago
 * @param {Function} callback - Callback(err, metodos)
 */
const obtenerMetodosPago = (callback) => {
    const query = 'SELECT idmetodo, nombre FROM tmetodopago WHERE estado = 1 ORDER BY nombre ASC';
    
    db.query(query, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results || []);
    });
};

module.exports = {
    crearVenta,
    obtenerVentas,
    obtenerDetallesVenta,
    obtenerMetodosPago
};
