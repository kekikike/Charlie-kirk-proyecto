/**
 * autenticacion.js - Middleware de autenticación y autorización
 * Funciona con JWT para proteger rutas y controlar roles
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiar_en_produccion';

/**
 * Middleware para verificar token (autenticación)
 */
const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ mensaje: 'Token inválido o expirado' });
        }

        // Guardamos info del usuario decodificado en la request
        req.usuario = decoded;
        next();
    });
};

/**
 * Middleware para permitir solo administradores
 * rol = 1 → admin
 */
const soloAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ mensaje: 'No autenticado' });
    }

    if (req.usuario.rol !== 1) {
        return res.status(403).json({ mensaje: 'Acceso denegado: solo admin' });
    }

    next();
};

/**
 * Middleware para permitir roles específicos
 * rolesPermitidos = array de números de rol
 */
const rolesPermitidos = (rolesPermitidos = []) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ mensaje: 'No autenticado' });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ mensaje: 'Acceso denegado: rol no autorizado' });
        }

        next();
    };
};

module.exports = {
    verificarToken,
    soloAdmin,
    rolesPermitidos,
};
