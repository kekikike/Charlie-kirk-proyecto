const jwt = require('jsonwebtoken');
const servicios = require('../servicios/autenticacion.js');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiar_en_produccion';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';

/**
 * Registrar nuevo usuario (Solo administrador)
 */
const registrarUsuario = (req, res) => {
    const { ciempleado } = req.usuario;
    const { nombre1, nombre2, apellido1, apellido2, fechanac, sexo, correo, telefono, contraseña, rol } = req.body;

    // Validar campos requeridos
    if (!nombre1 || !apellido1 || !correo || !telefono || !contraseña || !fechanac || sexo === undefined || !rol) {
        return res.status(400).json({ 
            mensaje: 'Por favor proporciona: nombre1, apellido1, correo, telefono, fechanac, sexo, contraseña y rol' 
        });
    }

    // Verificar que sea administrador
    servicios.esAdministrador(ciempleado, (err, esAdmin) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (!esAdmin) {
            return res.status(403).json({ 
                mensaje: 'Solo administradores pueden registrar usuarios' 
            });
        }

        // Verificar que el correo no exista
        servicios.obtenerUsuarioPorCorreo(correo, (err, usuarioExistente) => {
            if (err) return res.status(500).json({ error: err.message });

            if (usuarioExistente) {
                return res.status(400).json({ mensaje: 'El correo ya está registrado' });
            }

            // Encriptar contraseña
            servicios.encriptarContraseña(contraseña, (err, contraseñaEncriptada) => {
                if (err) return res.status(500).json({ error: 'Error al encriptar contraseña' });

                // Obtener próximo ID
                servicios.obtenerProximoIdEmpleado((err, nuevoId) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // Crear empleado
                    const datosEmpleado = {
                        ciempleado: nuevoId,
                        nombre1,
                        nombre2,
                        apellido1,
                        apellido2,
                        fechanac,
                        sexo,
                        correo,
                        contraseña: contraseñaEncriptada,
                        telefono,
                        rol,
                        usuarioA: ciempleado
                    };

                    servicios.crearEmpleado(datosEmpleado, (err, resultado) => {
                        if (err) return res.status(500).json({ error: err.message });

                        res.status(201).json({ 
                            mensaje: 'Usuario registrado exitosamente',
                            ciempleado: nuevoId
                        });
                    });
                });
            });
        });
    });
};

/**
 * Login de usuario
 */
const login = (req, res) => {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
        return res.status(400).json({ 
            mensaje: 'Por favor proporciona correo y contraseña' 
        });
    }

    // Buscar usuario
    servicios.obtenerUsuarioPorCorreo(correo, (err, usuario) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!usuario || usuario.estado === 0) {
            return res.status(401).json({ mensaje: 'Correo o contraseña inválidos' });
        }

        // Comparar contraseña
        servicios.compararContraseña(contraseña, usuario.contraseña, (err, esValida) => {
            if (err) return res.status(500).json({ error: 'Error al verificar contraseña' });

            if (!esValida) {
                return res.status(401).json({ mensaje: 'Correo o contraseña inválidos' });
            }

            // Generar JWT
            const token = jwt.sign(
                { 
                    ciempleado: usuario.ciempleado,
                    correo: usuario.correo,
                    nombre: `${usuario.nombre1} ${usuario.apellido1}`,
                    rol: usuario.rol
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ 
                mensaje: 'Login exitoso',
                token,
                usuario: {
                    ciempleado: usuario.ciempleado,
                    nombre1: usuario.nombre1,
                    apellido1: usuario.apellido1,
                    correo: usuario.correo,
                    rol: usuario.rol
                }
            });
        });
    });
};

/**
 * Obtener perfil del usuario autenticado
 */
const obtenerPerfil = (req, res) => {
    const { ciempleado } = req.usuario;

    servicios.obtenerPerfilCompleto(ciempleado, (err, usuario) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({ usuario });
    });
};

/**
 * Obtener lista de empleados (solo administradores)
 */
const obtenerEmpleados = (req, res) => {
    const { ciempleado } = req.usuario;

    // Verificar que sea administrador
    servicios.esAdministrador(ciempleado, (err, esAdmin) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (!esAdmin) {
            return res.status(403).json({ 
                mensaje: 'Solo administradores pueden ver la lista de empleados' 
            });
        }

        servicios.obtenerListaEmpleados((err, empleados) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ 
                mensaje: 'Empleados obtenidos exitosamente',
                empleados 
            });
        });
    });
};

/**
 * Actualizar estado de un empleado (activo/inactivo)
 */
const actualizarEstadoEmpleado = (req, res) => {
    const { ciempleado } = req.usuario;
    const { id } = req.params;
    const { estado } = req.body;

    // Validar estado
    if (estado !== 0 && estado !== 1) {
        return res.status(400).json({ 
            mensaje: 'Estado inválido. Debe ser 0 (inactivo) o 1 (activo)' 
        });
    }

    // Verificar que sea administrador
    servicios.esAdministrador(ciempleado, (err, esAdmin) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (!esAdmin) {
            return res.status(403).json({ 
                mensaje: 'Solo administradores pueden cambiar el estado de empleados' 
            });
        }

        servicios.actualizarEstadoEmpleado(id, estado, (err, resultado) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ 
                mensaje: 'Estado del empleado actualizado exitosamente',
                empleadoId: id,
                nuevoEstado: estado
            });
        });
    });
};

/**
 * Eliminar un empleado
 */
const eliminarEmpleado = (req, res) => {
    const { ciempleado } = req.usuario;
    const { id } = req.params;

    // Verificar que sea administrador
    servicios.esAdministrador(ciempleado, (err, esAdmin) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (!esAdmin) {
            return res.status(403).json({ 
                mensaje: 'Solo administradores pueden eliminar empleados' 
            });
        }

        servicios.eliminarEmpleado(id, (err, resultado) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ 
                mensaje: 'Empleado eliminado exitosamente',
                empleadoId: id
            });
        });
    });
};

module.exports = { registrarUsuario, login, obtenerPerfil, obtenerEmpleados, actualizarEstadoEmpleado, eliminarEmpleado };
