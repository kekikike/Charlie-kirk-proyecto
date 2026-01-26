/**
 * middleware/auditoria.js
 * Middleware para registrar todas las acciones importantes
 */

const auditLogs = require('../servicios/auditlogs.js');

/**
 * Middleware para registrar acciones automáticamente
 * Solo registra POST, PUT, DELETE (no GET)
 */
const middlewareAudit = (req, res, next) => {
    try {
        // Solo auditar si es POST, PUT, DELETE y hay usuario autenticado
        const ciempleado = req.usuario?.ciempleado || req.ciempleado;
        
        if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') && ciempleado) {
            const datosAccion = {
                ciempleado: ciempleado,
                accion: `${req.method} ${req.baseUrl}${req.path}`,
                tabla: extraerTabla(req.path),
                registro_id: extraerRegistroId(req),
                datos_nuevos: req.body,
                ip_address: obtenerIP(req),
                user_agent: req.get('user-agent'),
                resultado: 'exitoso'
            };

            // Guardar referencia a res.json original
            const originalJson = res.json.bind(res);

            // Interceptar respuesta
            res.json = function(data) {
                try {
                    // Si fue exitoso (status < 400), registrar como exitoso
                    if (res.statusCode < 400) {
                        datosAccion.resultado = 'exitoso';
                    } else {
                        // Si fue error, registrar como fallido
                        datosAccion.resultado = 'fallido';
                        datosAccion.detalles_error = data?.error || data?.mensaje || 'Error desconocido';
                    }

                    // Registrar en auditoría (sin esperar respuesta)
                    // Usar setImmediate para no bloquear la respuesta
                    setImmediate(() => {
                        try {
                            auditLogs.registrarAccion(datosAccion, (err) => {
                                if (err) {
                                    console.error('[AUDIT ERROR]', err.message);
                                }
                            });
                        } catch(e) {
                            console.error('[AUDIT EXCEPTION]', e.message);
                        }
                    });
                } catch(e) {
                    console.error('Error en middleware de auditoría:', e.message);
                }

                // Llamar al json original SIEMPRE
                return originalJson(data);
            };
        }
    } catch(e) {
        console.error('Error fatal en middleware de auditoría:', e.message);
    }

    next();
};

/**
 * Extrae el nombre de la tabla de la ruta
 */
function extraerTabla(path) {
    const partes = path.split('/');
    return partes[2] || null;
}

/**
 * Extrae el ID del registro de los parámetros
 */
function extraerRegistroId(req) {
    return req.params.id || req.params.cod || req.params.codproducto || req.body?.id || null;
}

/**
 * Obtiene la IP real del cliente
 */
function obtenerIP(req) {
    return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
           req.socket.remoteAddress ||
           req.connection.remoteAddress;
}

module.exports = middlewareAudit;
