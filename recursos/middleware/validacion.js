/**
 * middleware/validacion.js
 * Validación y sanitización de entrada para prevenir SQL injection y XSS
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            mensaje: 'Error de validación',
            errores: errors.array().map(e => ({
                campo: e.param,
                mensaje: e.msg,
                valor: e.value
            }))
        });
    }
    next();
};

/**
 * Validaciones para login
 */
const validarLogin = [
    body('correo')
        .isEmail().withMessage('Correo inválido')
        .normalizeEmail()
        .trim(),
    body('contraseña')
        .isLength({ min: 1 }).withMessage('Contraseña requerida'),
    handleValidationErrors
];

/**
 * Validaciones para registro de usuario
 */
const validarRegistroUsuario = [
    body('nombre1')
        .trim()
        .isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres')
        .matches(/^[a-záéíóúñ\s]+$/i).withMessage('Nombre solo puede contener letras'),
    body('nombre2')
        .optional()
        .trim()
        .matches(/^[a-záéíóúñ\s]*$/i).withMessage('Nombre solo puede contener letras'),
    body('apellido1')
        .trim()
        .isLength({ min: 2 }).withMessage('Apellido debe tener al menos 2 caracteres')
        .matches(/^[a-záéíóúñ\s]+$/i).withMessage('Apellido solo puede contener letras'),
    body('apellido2')
        .optional()
        .trim()
        .matches(/^[a-záéíóúñ\s]*$/i).withMessage('Apellido solo puede contener letras'),
    body('correo')
        .isEmail().withMessage('Correo inválido')
        .normalizeEmail()
        .trim(),
    body('telefono')
        .isMobilePhone().withMessage('Teléfono inválido'),
    body('fechanac')
        .isISO8601().withMessage('Fecha inválida'),
    body('sexo')
        .isIn(['0', '1']).withMessage('Sexo debe ser 0 o 1'),
    body('contraseña')
        .isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Contraseña debe contener mayúscula, minúscula y número'),
    body('rol')
        .isIn(['1', '2']).withMessage('Rol inválido'),
    handleValidationErrors
];

/**
 * Validaciones para crear producto
 */
const validarProducto = [
    body('nombre')
        .trim()
        .isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres')
        .isLength({ max: 100 }).withMessage('Nombre no puede exceder 100 caracteres'),
    body('idcategoria')
        .isInt({ min: 1 }).withMessage('Categoría inválida'),
    body('preciounitario')
        .isFloat({ min: 0.01 }).withMessage('Precio debe ser mayor a 0'),
    handleValidationErrors
];

/**
 * Validaciones para inventario
 */
const validarInventario = [
    body('codproducto')
        .trim()
        .isLength({ min: 1 }).withMessage('Código de producto requerido'),
    body('stock')
        .isInt({ min: 1 }).withMessage('Stock debe ser un número positivo'),
    body('fechaingreso')
        .isISO8601().withMessage('Fecha de ingreso inválida'),
    body('fechavencimiento')
        .optional()
        .isISO8601().withMessage('Fecha de vencimiento inválida'),
    handleValidationErrors
];

/**
 * Validaciones para venta
 */
const validarVenta = [
    body('subtotal')
        .isFloat({ min: 0 }).withMessage('Subtotal inválido'),
    body('total')
        .isFloat({ min: 0 }).withMessage('Total inválido'),
    body('idmetodo')
        .isInt({ min: 1, max: 3 }).withMessage('Método de pago inválido'),
    body('detalles')
        .isArray({ min: 1 }).withMessage('Debe tener al menos un producto'),
    body('detalles.*.codproducto')
        .trim()
        .isLength({ min: 1 }).withMessage('Código de producto requerido'),
    body('detalles.*.cantidad')
        .isInt({ min: 1 }).withMessage('Cantidad debe ser un número positivo'),
    body('detalles.*.preciounitario')
        .isFloat({ min: 0 }).withMessage('Precio unitario inválido'),
    body('detalles.*.subtotal')
        .isFloat({ min: 0 }).withMessage('Subtotal inválido'),
    handleValidationErrors
];

module.exports = {
    validarLogin,
    validarRegistroUsuario,
    validarProducto,
    validarInventario,
    validarVenta,
    handleValidationErrors
};
