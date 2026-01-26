/**
 * middleware/autorizacion.js
 * Autorización granular por rol y acción
 */

const auditLogs = require('../servicios/auditlogs.js');

/**
 * Verificar si usuario tiene permisos específicos
 */
const verificarPermiso = (accionRequerida) => {
    return (req, res, next) => {
        const { ciempleado, rol } = req.usuario;
        
        // Matriz de permisos por rol
        const permisos = {
            1: { // Administrador - permisos totales
                usuarios: ['crear', 'leer', 'actualizar', 'eliminar'],
                productos: ['crear', 'leer', 'actualizar', 'eliminar', 'activar', 'desactivar'],
                inventario: ['crear', 'leer', 'actualizar', 'eliminar'],
                ventas: ['crear', 'leer', 'actualizar'],
                empleados: ['crear', 'leer', 'actualizar', 'eliminar'],
                reportes: ['leer'],
                auditoría: ['leer']
            },
            2: { // Vendedor - permisos limitados
                productos: ['leer'],
                ventas: ['crear', 'leer'],
                inventario: ['leer'],
                reportes: ['leer']
            }
        };

        const [recurso, accion] = accionRequerida.split(':');
        const permisosUsuario = permisos[rol];

        if (!permisosUsuario || !permisosUsuario[recurso] || !permisosUsuario[recurso].includes(accion)) {
            // Registrar intento de acceso no autorizado
            auditLogs.registrarAccion({
                ciempleado,
                accion: `INTENTO ACCESO NO AUTORIZADO: ${accionRequerida}`,
                ip_address: obtenerIP(req),
                user_agent: req.get('user-agent'),
                resultado: 'fallido',
                detalles_error: `Acceso denegado a ${accionRequerida}`
            }, () => {});

            return res.status(403).json({ 
                mensaje: 'No tienes permisos para realizar esta acción',
                accion: accionRequerida,
                rol: rol
            });
        }

        next();
    };
};

/**
 * Solo administradores
 */
const soloAdmin = (req, res, next) => {
    if (req.usuario.rol !== 1) {
        auditLogs.registrarAccion({
            ciempleado: req.usuario.ciempleado,
            accion: 'INTENTO ACCESO ADMIN',
            ip_address: obtenerIP(req),
            user_agent: req.get('user-agent'),
            resultado: 'fallido',
            detalles_error: 'Usuario no es administrador'
        }, () => {});

        return res.status(403).json({ 
            mensaje: 'Solo administradores pueden acceder a esto' 
        });
    }
    next();
};

/**
 * Solo si es el propietario del registro o admin
 */
const esProietarioOAdmin = (recurso) => {
    return (req, res, next) => {
        const { ciempleado, rol } = req.usuario;
        
        if (rol === 1) {
            // Admin puede todo
            return next();
        }

        // Verificar si es el dueño del registro
        const idRecurso = req.params.id || req.params.cod || req.body?.ciempleado;
        
        if (idRecurso && ciempleado !== parseInt(idRecurso)) {
            auditLogs.registrarAccion({
                ciempleado,
                accion: `INTENTO ACCESO NO AUTORIZADO RECURSO: ${recurso}`,
                registro_id: idRecurso,
                ip_address: obtenerIP(req),
                user_agent: req.get('user-agent'),
                resultado: 'fallido',
                detalles_error: 'No es propietario del recurso'
            }, () => {});

            return res.status(403).json({ 
                mensaje: 'No puedes acceder a este recurso' 
            });
        }

        next();
    };
};

/**
 * Obtiene la IP real del cliente
 */
function obtenerIP(req) {
    return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
           req.socket.remoteAddress ||
           req.connection.remoteAddress;
}

module.exports = {
    verificarPermiso,
    soloAdmin,
    esProietarioOAdmin
};
