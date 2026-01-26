/**
 * controladores/auditlogs.js
 * Controlador para consultar registros de auditoría
 */

const auditLogs = require('../servicios/auditlogs.js');

/**
 * Obtener historial de auditoría con filtros
 */
const obtenerHistorial = (req, res) => {
    const { ciempleado, accion, tabla, fecha_inicio, fecha_fin, limite } = req.query;

    const filtros = {
        ciempleado: ciempleado ? parseInt(ciempleado) : null,
        accion,
        tabla,
        fecha_inicio,
        fecha_fin,
        limite: limite ? parseInt(limite) : 100
    };

    auditLogs.obtenerHistorial(filtros, (err, registros) => {
        if (err) {
            return res.status(500).json({ 
                error: err.message 
            });
        }

        res.json({
            total: registros.length,
            registros
        });
    });
};

module.exports = {
    obtenerHistorial
};
