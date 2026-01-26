/**
 * middleware/rateLimiting.js
 * Protección contra ataques de fuerza bruta y abuso
 */

const rateLimit = require('express-rate-limit');

/**
 * Rate limiter para login - más restrictivo
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos
    message: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // No limitar si es localhost
        return req.ip === '127.0.0.1' || req.ip === '::1';
    }
});

/**
 * Rate limiter general para API - menos restrictivo
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 peticiones
    message: 'Demasiadas peticiones. Intenta de nuevo más tarde',
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Rate limiter para crear/actualizar - restrictivo
 */
const strictLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 30, // máximo 30 peticiones por minuto
    message: 'Operación rechazada. Estás siendo demasiado rápido',
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    loginLimiter,
    apiLimiter,
    strictLimiter
};
