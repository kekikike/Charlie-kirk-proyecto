/**
 * servicios/auditlogs.js
 * Servicio para registrar auditoría de acciones
 */

const db = require('../config/conexion.js');

/**
 * Registra una acción en el sistema de auditoría
 */
const registrarAccion = (datos, callback) => {
    const {
        ciempleado,
        accion,
        tabla,
        registro_id,
        datos_anteriores,
        datos_nuevos,
        ip_address,
        user_agent,
        resultado = 'exitoso',
        detalles_error = null
    } = datos;

    const query = `
        INSERT INTO tauditlogs (
            ciempleado, accion, tabla, registro_id, 
            datos_anteriores, datos_nuevos, 
            ip_address, user_agent, resultado, detalles_error
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        ciempleado,
        accion,
        tabla || null,
        registro_id || null,
        datos_anteriores ? JSON.stringify(datos_anteriores) : null,
        datos_nuevos ? JSON.stringify(datos_nuevos) : null,
        ip_address || null,
        user_agent || null,
        resultado,
        detalles_error
    ];

    db.query(query, valores, (err, result) => {
        if (err) {
            if (callback) callback(err, null);
            return;
        }
        if (callback) callback(null, { idaudit: result.insertId });
    });
};

/**
 * Obtiene el historial de auditoría con filtros
 */
const obtenerHistorial = (filtros, callback) => {
    const { ciempleado, accion, tabla, fecha_inicio, fecha_fin, limite = 100 } = filtros;
    
    let query = `
        SELECT a.*, e.nombre1, e.apellido1
        FROM tauditlogs a
        LEFT JOIN templeados e ON a.ciempleado = e.ciempleado
        WHERE 1=1
    `;
    
    const parametros = [];

    if (ciempleado) {
        query += ` AND a.ciempleado = ?`;
        parametros.push(ciempleado);
    }

    if (accion) {
        query += ` AND a.accion LIKE ?`;
        parametros.push(`%${accion}%`);
    }

    if (tabla) {
        query += ` AND a.tabla = ?`;
        parametros.push(tabla);
    }

    if (fecha_inicio) {
        query += ` AND a.fecharegistro >= ?`;
        parametros.push(fecha_inicio);
    }

    if (fecha_fin) {
        query += ` AND a.fecharegistro <= ?`;
        parametros.push(fecha_fin);
    }

    query += ` ORDER BY a.fecharegistro DESC LIMIT ?`;
    parametros.push(limite);

    db.query(query, parametros, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

module.exports = {
    registrarAccion,
    obtenerHistorial
};
