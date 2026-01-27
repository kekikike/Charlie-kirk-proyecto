/**
 * Servicios de Ventas - Lógica de negocio para gestión de ventas
 */

const db = require('../config/conexion.js');

/**
 * Crea una nueva venta
 */
const crearVenta = (datos, callback) => {
    const { ciempleado, subtotal, total, idmetodo, ci_nit, detalles } = datos;

    const queryVenta = `
        INSERT INTO tventas
        (ci_nit, ciempleado, subtotal, total, idmetodo, fechaventa, hora, fecharegistro, estado, usuarioA)
        VALUES (?, ?, ?, ?, ?, CURDATE(), CURTIME(), NOW(), 1, ?)
    `;

    db.query(
        queryVenta,
        [ci_nit || null, ciempleado, subtotal, total, idmetodo, ciempleado],
        (err, result) => {
            if (err) return callback(err);

            const idventa = result.insertId;
            let procesados = 0;

            if (!Array.isArray(detalles) || detalles.length === 0) {
                return callback(null, { idventa, total, detallesInsertados: 0 });
            }

            detalles.forEach(detalle => {

                // INSERTAR DETALLE
                const queryDetalle = `
                    INSERT INTO tdetalleventa
                    (idventa, codproducto, cantidad, preciounitario, subtotal, estado, usuarioA)
                    VALUES (?, ?, ?, ?, ?, 1, ?)
                `;

                db.query(
                    queryDetalle,
                    [
                        idventa,
                        detalle.codproducto,
                        Number(detalle.cantidad),
                        detalle.preciounitario,
                        detalle.subtotal,
                        ciempleado
                    ],
                    (err) => {
                        if (err) {
                            console.error('[DETALLE]', err);
                        }

                        // REDUCIR STOCK (MISMO FLUJO, MISMO CALLBACK)
                        const queryStock = `
                            UPDATE tinventario
                            SET stock = stock - ?
                            WHERE codproducto = ?
                              AND estado = 1
                              AND estadolote = 1
                        `;

                        db.query(
                            queryStock,
                            [
                                Number(detalle.cantidad),
                                detalle.codproducto
                            ],
                            (err) => {
                                if (err) {
                                    console.error('[STOCK]', err);
                                }

                                procesados++;

                                if (procesados === detalles.length) {
                                    callback(null, {
                                        idventa,
                                        total,
                                        detallesInsertados: procesados
                                    });
                                }
                            }
                        );
                    }
                );
            });
        }
    );
};

/**
 * Obtiene lista de ventas
 */
const obtenerVentas = (callback) => {
    const query = `
        SELECT 
            tv.idventa,
            tv.ciempleado,
            tv.subtotal,
            tv.total,
            tv.idmetodo,
            tm.nombre AS metodo,
            tv.fecharegistro,
            tv.estado,
            te.nombre1,
            te.apellido1,
            COUNT(tdv.iddetalle) AS cantidad_productos
        FROM tventas tv
        LEFT JOIN tmetodopago tm ON tv.idmetodo = tm.idmetodo
        LEFT JOIN templeados te ON tv.ciempleado = te.ciempleado
        LEFT JOIN tdetalleventa tdv ON tv.idventa = tdv.idventa
        GROUP BY tv.idventa
        ORDER BY tv.fecharegistro DESC
    `;

    db.query(query, (err, rows) => {
        if (err) return callback(err);
        callback(null, rows || []);
    });
};

/**
 * Obtiene detalles de una venta
 */
const obtenerDetallesVenta = (idventa, callback) => {
    const query = `
        SELECT
            tdv.codproducto,
            tdv.cantidad,
            tdv.preciounitario,
            tdv.subtotal,
            tp.nombre AS nombre_producto
        FROM tdetalleventa tdv
        LEFT JOIN tproductos tp ON tdv.codproducto = tp.codproducto
        WHERE tdv.idventa = ?
        ORDER BY tdv.codproducto
    `;

    db.query(query, [idventa], (err, rows) => {
        if (err) return callback(err);
        callback(null, rows || []);
    });
};

/**
 * Obtiene métodos de pago
 */
const obtenerMetodosPago = (callback) => {
    const query = `
        SELECT idmetodo, nombre
        FROM tmetodopago
        WHERE estado = 1
        ORDER BY nombre
    `;

    db.query(query, (err, rows) => {
        if (err) return callback(err);
        callback(null, rows || []);
    });
};

module.exports = {
    crearVenta,
    obtenerVentas,
    obtenerDetallesVenta,
    obtenerMetodosPago
};
