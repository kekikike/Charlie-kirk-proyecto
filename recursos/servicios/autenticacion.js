/**
 * Servicios - Lógica de negocio reutilizable
 * Separa la lógica compleja de los controladores
 */

const bcrypt = require('bcryptjs');
const db = require('../config/conexion.js');
const { encriptarDato, desencriptarDato, ocultarDato } = require('./encriptacion.js');

/**
 * Valida si un usuario es administrador
 * @param {number} ciempleado - ID del empleado
 * @param {Function} callback - Callback(err, esAdmin)
 */
const esAdministrador = (ciempleado, callback) => {
    db.query(
        'SELECT rol FROM templeados WHERE ciempleado = ? AND rol = 1',
        [ciempleado],
        (err, results) => {
            if (err) return callback(err, false);
            callback(null, results.length > 0);
        }
    );
};

/**
 * Busca un usuario por correo
 * @param {string} correo - Correo del usuario
 * @param {Function} callback - Callback(err, usuario)
 */
const obtenerUsuarioPorCorreo = (correo, callback) => {
    db.query('SELECT * FROM templeados WHERE correo = ?', [correo], (err, results) => {
        if (err) return callback(err, null);
        const usuario = results.length > 0 ? results[0] : null;
        callback(null, usuario);
    });
};

/**
 * Busca un usuario por ID
 * @param {number} ciempleado - ID del empleado
 * @param {Function} callback - Callback(err, usuario)
 */
const obtenerUsuarioPorId = (ciempleado, callback) => {
    db.query('SELECT * FROM templeados WHERE ciempleado = ?', [ciempleado], (err, results) => {
        if (err) return callback(err, null);
        const usuario = results.length > 0 ? results[0] : null;
        callback(null, usuario);
    });
};

/**
 * Obtiene el próximo ID disponible para empleados
 * @param {Function} callback - Callback(err, nuevoId)
 */
const obtenerProximoIdEmpleado = (callback) => {
    db.query('SELECT MAX(ciempleado) as maxId FROM templeados', (err, results) => {
        if (err) return callback(err, null);
        const nuevoId = (results[0].maxId || 0) + 1;
        callback(null, nuevoId);
    });
};

/**
 * Encripta una contraseña
 * @param {string} contraseña - Contraseña a encriptar
 * @param {Function} callback - Callback(err, contraseñaEncriptada)
 */
const encriptarContraseña = (contraseña, callback) => {
    const saltRounds = 10;
    bcrypt.hash(contraseña, saltRounds, (err, contraseñaEncriptada) => {
        if (err) return callback(err, null);
        callback(null, contraseñaEncriptada);
    });
};

/**
 * Compara una contraseña con su hash
 * @param {string} contraseña - Contraseña ingresada
 * @param {string} hash - Hash guardado en BD
 * @param {Function} callback - Callback(err, esValida)
 */
const compararContraseña = (contraseña, hash, callback) => {
    bcrypt.compare(contraseña, hash, (err, esValida) => {
        if (err) return callback(err, false);
        callback(null, esValida);
    });
};

/**
 * Crea un nuevo empleado
 * @param {Object} datos - Datos del empleado
 * @param {Function} callback - Callback(err, resultado)
 */
const crearEmpleado = (datos, callback) => {
    const { ciempleado, nombre1, nombre2, apellido1, apellido2, fechanac, sexo, correo, contraseña, telefono, rol, usuarioA } = datos;

    // Encriptar datos sensibles
    const correo_enc = encriptarDato(correo);
    const telefono_enc = encriptarDato(telefono);

    // Guardamos tanto la versión encriptada (para seguridad/visualización) 
    // como la plana (para búsquedas exactas como el login)
    const query = `
        INSERT INTO templeados 
        (ciempleado, nombre1, nombre2, apellido1, apellido2, fechanac, sexo, correo, correo_enc, contraseña, telefono, telefono_enc, rol, estado, usuarioA) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `;

    db.query(query, [ciempleado, nombre1, nombre2 || null, apellido1, apellido2 || null, fechanac, sexo, correo, correo_enc, contraseña, telefono, telefono_enc, rol, usuarioA],
        (err, results) => {
            if (err) return callback(err, null);
            callback(null, { ciempleado, nombre1, apellido1, correo });
        }
    );
};

/**
 * Obtiene el perfil completo de un usuario
 * @param {number} ciempleado - ID del empleado
 * @param {Function} callback - Callback(err, perfil)
 */
const obtenerPerfilCompleto = (ciempleado, callback) => {
    const query = `
        SELECT 
            em.ciempleado, em.nombre1, em.nombre2, em.apellido1, em.apellido2, 
            em.correo_enc, em.telefono_enc, em.fecharegistro, em.rol,
            tr.nombre as rolNombre
        FROM templeados em
        LEFT JOIN troles tr ON em.rol = tr.idrol
        WHERE em.ciempleado = ?
    `;

    db.query(query, [ciempleado], (err, results) => {
        if (err) return callback(err, null);
        if (results.length === 0) return callback(null, null);

        const perfil = results[0];
        // Desencriptar datos sensibles
        const perfilDesencriptado = {
            ...perfil,
            correo: perfil.correo_enc ? desencriptarDato(perfil.correo_enc) : null,
            telefono: perfil.telefono_enc ? desencriptarDato(perfil.telefono_enc) : null
        };

        callback(null, perfilDesencriptado);
    });
};

/**
 * Obtiene lista de todos los empleados
 * @param {Function} callback - Callback(err, empleados)
 */
const obtenerListaEmpleados = (callback) => {
    const query = `
        SELECT 
            em.ciempleado, em.nombre1, em.nombre2, em.apellido1, em.apellido2, 
            em.correo_enc, em.telefono_enc, em.rol, em.estado,
            tr.nombre as rolNombre
        FROM templeados em
        LEFT JOIN troles tr ON em.rol = tr.idrol
        ORDER BY em.ciempleado ASC
    `;

    db.query(query, (err, results) => {
        if (err) return callback(err, null);

        // Desencriptar datos sensibles
        const empleadosDesencriptados = results.map(emp => {
            try {
                return {
                    ...emp,
                    correo: emp.correo_enc ? desencriptarDato(emp.correo_enc) : null,
                    telefono: emp.telefono_enc ? desencriptarDato(emp.telefono_enc) : null
                };
            } catch (e) {
                console.error(`Error desencriptando empleado ${emp.ciempleado}:`, e);
                return {
                    ...emp,
                    correo: 'Error desencriptando',
                    telefono: 'Error desencriptando'
                };
            }
        });

        callback(null, empleadosDesencriptados || []);
    });
};

/**
 * Actualiza el estado de un empleado
 * @param {number} ciempleado - ID del empleado
 * @param {number} estado - Nuevo estado (0=inactivo, 1=activo)
 * @param {Function} callback - Callback(err, resultado)
 */
const actualizarEstadoEmpleado = (ciempleado, estado, callback) => {
    const query = 'UPDATE templeados SET estado = ? WHERE ciempleado = ?';

    db.query(query, [estado, ciempleado], (err, results) => {
        if (err) return callback(err, null);
        if (results.affectedRows === 0) {
            return callback(new Error('Empleado no encontrado'), null);
        }
        callback(null, { ciempleado, estado });
    });
};

/**
 * Elimina un empleado de la base de datos
 * @param {number} ciempleado - ID del empleado
 * @param {Function} callback - Callback(err, resultado)
 */
const eliminarEmpleado = (ciempleado, callback) => {
    const query = 'DELETE FROM templeados WHERE ciempleado = ?';

    db.query(query, [ciempleado], (err, results) => {
        if (err) return callback(err, null);
        if (results.affectedRows === 0) {
            return callback(new Error('Empleado no encontrado'), null);
        }
        callback(null, { ciempleado, eliminado: true });
    });
};

module.exports = {
    esAdministrador,
    obtenerUsuarioPorCorreo,
    obtenerUsuarioPorId,
    obtenerProximoIdEmpleado,
    encriptarContraseña,
    compararContraseña,
    crearEmpleado,
    obtenerPerfilCompleto,
    obtenerListaEmpleados,
    actualizarEstadoEmpleado,
    eliminarEmpleado
};
