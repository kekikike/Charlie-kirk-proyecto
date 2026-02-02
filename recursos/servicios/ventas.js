/**
 * Servicios de Ventas - Lógica de negocio para gestión de ventas
 */

const db = require('../config/conexion.js');
const { encriptarDato, desencriptarDato, ocultarDato } = require('./encriptacion.js');

/**
 * Crea una nueva venta con descuento de stock por lotes FIFO
 */
const crearVenta = (datos, callback) => {
    const { ciempleado, subtotal, total, idmetodo, ci_nit, detalles } = datos;

    // Encriptar datos sensibles de la venta
    const ci_nit_enc = ci_nit ? encriptarDato(ci_nit) : null;
    const ciempleado_enc = encriptarDato(ciempleado);

    // Guardamos: 
    // - ci_nit_enc (SOLO ENCRIPTADO - el CI del cliente)
    // - ciempleado (sin encriptar - es FK y se necesita para JOIN)
    // - ciempleado_enc (encriptado - para mostrar)
    const queryVenta = `
        INSERT INTO tventas
        (ci_nit_enc, ciempleado, ciempleado_enc, subtotal, total, idmetodo, ci_nit, fechaventa, hora, fecharegistro, estado, usuarioA)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME(), NOW(), 1, ?)
    `;

    db.query(
        queryVenta,
        [ci_nit_enc, ciempleado, ciempleado_enc, subtotal, total, idmetodo, ci_nit ? parseInt(ci_nit) : null, ciempleado],
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

                        // === REDUCIR STOCK POR LOTES (FIFO) ===
                        const queryLotesFIFO = `
                            SELECT codinventario, stock
                            FROM tinventario
                            WHERE codproducto = ?
                              AND estado = 1
                              AND estadolote = 1
                              AND stock > 0
                            ORDER BY fechaingreso ASC
                        `;

                        db.query(queryLotesFIFO, [detalle.codproducto], (err, lotes) => {
                            if (err) {
                                console.error('[FIFO SELECT]', err);
                                return;
                            }

                            let cantidadRestante = Number(detalle.cantidad);

                            lotes.forEach(lote => {
                                if (cantidadRestante <= 0) return;

                                const descontar = Math.min(lote.stock, cantidadRestante);
                                cantidadRestante -= descontar;

                                const queryUpdateLote = `
                                    UPDATE tinventario
                                    SET stock = stock - ?,
                                        estadolote = CASE WHEN stock - ? <= 0 THEN 0 ELSE estadolote END
                                    WHERE codinventario = ?
                                `;

                                db.query(queryUpdateLote, [descontar, descontar, lote.codinventario], (err) => {
                                    if (err) {
                                        console.error('[FIFO UPDATE]', err);
                                    }
                                });
                            });

                            if (cantidadRestante > 0) {
                                console.error('[FIFO] Stock insuficiente para producto:', detalle.codproducto);
                            }

                            procesados++;

                            if (procesados === detalles.length) {
                                callback(null, {
                                    idventa,
                                    total,
                                    detallesInsertados: procesados
                                });
                            }
                        });
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
            tv.ciempleado_enc,
            tv.ci_nit,
            tv.ci_nit_enc,
            tv.subtotal,
            tv.total,
            tv.idmetodo,
            tm.nombre AS metodo,
            tv.fecharegistro,
            tv.estado,
            te.nombre1,
            te.apellido1,
            tc.nombre as cliente_nombre,
            tc.apellido as cliente_apellido,
            COALESCE(SUM(tdv.cantidad), 0) AS cantidad_productos
        FROM tventas tv
        LEFT JOIN tmetodopago tm ON tv.idmetodo = tm.idmetodo
        LEFT JOIN templeados te ON tv.ciempleado = te.ciempleado
        LEFT JOIN tclientes tc ON tv.ci_nit = tc.ci_nit
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
 * Obtiene ventas con control de acceso
 * Si es vendedor, solo ve completas sus propias ventas
 * Las de otros vendedores aparecen con datos ocultos (**)
 * @param {number} ciempleado - ID del empleado (vendedor) que solicita
 * @param {number} rol - Rol del usuario (1=admin, 2=vendedor)
 * @param {Function} callback - Callback(err, ventas)
 */
const obtenerVentasConAcceso = (ciempleado, rol, callback) => {
    const query = `
        SELECT 
            tv.idventa,
            tv.ciempleado,
            tv.ciempleado_enc,
            tv.ci_nit_enc,
            tv.subtotal,
            tv.total,
            tv.idmetodo,
            tm.nombre AS metodo,
            tv.fecharegistro,
            tv.estado,
            te.nombre1,
            te.apellido1,
            tc.nombre as cliente_nombre,
            tc.apellido as cliente_apellido,
            tc.ci_nit as cliente_ci,
            COALESCE(SUM(tdv.cantidad), 0) AS cantidad_productos
        FROM tventas tv
        LEFT JOIN tmetodopago tm ON tv.idmetodo = tm.idmetodo
        LEFT JOIN templeados te ON tv.ciempleado = te.ciempleado
        LEFT JOIN tclientes tc ON tv.ci_nit = tc.ci_nit
        LEFT JOIN tdetalleventa tdv ON tv.idventa = tdv.idventa
        GROUP BY tv.idventa
        ORDER BY tv.fecharegistro DESC
    `;

    db.query(query, (err, rows) => {
        if (err) return callback(err);

        // Si es administrador, retorna todo sin ocultar
        if (rol === 1) {
            // Desencriptar solo ci_nit_enc para admin
            const ventasDesencriptadas = rows.map(venta => ({
                ...venta,
                ci_nit: venta.ci_nit_enc ? desencriptarDato(venta.ci_nit_enc) : null
            }));
            return callback(null, ventasDesencriptadas || []);
        }

        // Si es vendedor, aplicar restricciones
        const ventasControl = rows.map(venta => {
            // Si la venta es de este vendedor, mostrar completo
            if (parseInt(venta.ciempleado) === parseInt(ciempleado)) {
                return {
                    ...venta,
                    ci_nit: venta.ci_nit_enc ? desencriptarDato(venta.ci_nit_enc) : null,
                    cliente_nombre: venta.cliente_nombre,
                    cliente_apellido: venta.cliente_apellido,
                    cliente_ci: venta.cliente_ci,
                    es_propia: true
                };
            } else {
                // Si es de otro vendedor, ocultar datos del cliente y vendedor
                return {
                    ...venta,
                    cliente_nombre: '**',
                    cliente_apellido: '**',
                    cliente_ci: '**',
                    nombre1: '**',
                    apellido1: '**',
                    es_propia: false
                };
            }
        });

        callback(null, ventasControl || []);
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

/**
 * Obtiene estadísticas generales para el dashboard
 */
const obtenerEstadisticas = (callback) => {
    const queries = {
        ventas: "SELECT COALESCE(SUM(total), 0) as total_ventas, COUNT(*) as cantidad_ventas FROM tventas WHERE estado = 1",
        productos: "SELECT COUNT(*) as total_productos FROM tproductos WHERE estado = 1",
        clientes: "SELECT COUNT(*) as total_clientes FROM tclientes WHERE estado = 1",
        empleados: "SELECT COUNT(*) as total_empleados FROM templeados WHERE estado = 1"
    };

    db.query(queries.ventas, (err, ventasRes) => {
        if (err) return callback(err);

        db.query(queries.productos, (err, prodRes) => {
            if (err) return callback(err);

            db.query(queries.clientes, (err, cliRes) => {
                if (err) return callback(err);

                db.query(queries.empleados, (err, empRes) => {
                    if (err) return callback(err);

                    callback(null, {
                        ventas: ventasRes[0],
                        productos: prodRes[0].total_productos,
                        clientes: cliRes[0].total_clientes,
                        empleados: empRes[0].total_empleados
                    });
                });
            });
        });
    });
};

module.exports = {
    crearVenta,
    obtenerVentas,
    obtenerVentasConAcceso,
    obtenerDetallesVenta,
    obtenerMetodosPago,
    obtenerEstadisticas
};
