/**
 * Servicios de Clientes - Lógica de negocio para gestión de clientes
 */

const db = require('../config/conexion.js');

/**
 * Crea un nuevo cliente
 * @param {Object} datos - Datos del cliente
 * @param {Function} callback - Callback(err, resultado)
 */
const crearCliente = (datos, callback) => {
    const { ci_nit, nombre, apellido, correo, usuarioA } = datos;
    
    const query = `
        INSERT INTO tclientes (ci_nit, nombre, apellido, correo, estado, usuarioA)
        VALUES (?, ?, ?, ?, 1, ?)
    `;
    
    db.query(query, [ci_nit, nombre, apellido, correo, usuarioA], (err, result) => {
        if (err) {
            console.error('[CLIENTES] Error al insertar:', err.message);
            return callback(err, null);
        }
        
        // Retornar los datos del cliente creado
        const clienteCreado = {
            ci_nit,
            nombre,
            apellido,
            correo,
            estado: 1
        };
        
        callback(null, clienteCreado);
    });
};

/**
 * Obtiene lista de todos los clientes
 * @param {Function} callback - Callback(err, clientes)
 */
const obtenerClientes = (callback) => {
    const query = `
        SELECT 
            ci_nit,
            nombre,
            apellido,
            correo,
            fecharegistro,
            estado
        FROM tclientes
        WHERE estado = 1
        ORDER BY fecharegistro DESC
    `;
    
    db.query(query, (err, clientes) => {
        if (err) {
            console.error('[CLIENTES] Error al obtener:', err.message);
            return callback(err, null);
        }
        
        callback(null, clientes || []);
    });
};

/**
 * Obtiene un cliente por su ID (C.I./NIT)
 * @param {number} ci_nit - C.I./NIT del cliente
 * @param {Function} callback - Callback(err, cliente)
 */
const obtenerClientePorId = (ci_nit, callback) => {
    const query = `
        SELECT 
            ci_nit,
            nombre,
            apellido,
            correo,
            fecharegistro,
            estado
        FROM tclientes
        WHERE ci_nit = ? AND estado = 1
    `;
    
    db.query(query, [ci_nit], (err, results) => {
        if (err) {
            console.error('[CLIENTES] Error al obtener por ID:', err.message);
            return callback(err, null);
        }
        
        callback(null, results.length > 0 ? results[0] : null);
    });
};

/**
 * Actualiza un cliente
 * @param {number} ci_nit - C.I./NIT del cliente
 * @param {Object} datos - Datos a actualizar
 * @param {Function} callback - Callback(err, resultado)
 */
const actualizarCliente = (ci_nit, datos, callback) => {
    const { nombre, apellido, correo } = datos;
    
    let campos = [];
    let valores = [];
    
    if (nombre) {
        campos.push('nombre = ?');
        valores.push(nombre);
    }
    if (apellido) {
        campos.push('apellido = ?');
        valores.push(apellido);
    }
    if (correo) {
        campos.push('correo = ?');
        valores.push(correo);
    }
    
    if (campos.length === 0) {
        return callback(new Error('No hay campos para actualizar'), null);
    }
    
    valores.push(ci_nit);
    
    const query = `UPDATE tclientes SET ${campos.join(', ')} WHERE ci_nit = ?`;
    
    db.query(query, valores, (err, result) => {
        if (err) {
            console.error('[CLIENTES] Error al actualizar:', err.message);
            return callback(err, null);
        }
        
        callback(null, { ci_nit, ...datos });
    });
};

/**
 * Elimina (desactiva) un cliente
 * @param {number} ci_nit - C.I./NIT del cliente
 * @param {Function} callback - Callback(err, resultado)
 */
const eliminarCliente = (ci_nit, callback) => {
    const query = `UPDATE tclientes SET estado = 0 WHERE ci_nit = ?`;
    
    db.query(query, [ci_nit], (err, result) => {
        if (err) {
            console.error('[CLIENTES] Error al eliminar:', err.message);
            return callback(err, null);
        }
        
        callback(null, { mensaje: 'Cliente desactivado', ci_nit });
    });
};

module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente
};
