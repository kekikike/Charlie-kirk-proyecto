/**
 * Controlador de Clientes
 */

const servicios = require('../servicios/clientes.js');

/**
 * Crear un nuevo cliente
 */
const crearCliente = (req, res) => {
    const { ciempleado } = req.usuario;
    const { ci_nit, nombre, apellido, correo } = req.body;

    // Validaciones
    if (!ci_nit || !nombre || !apellido) {
        return res.status(400).json({ 
            mensaje: 'Por favor proporciona: ci_nit, nombre y apellido' 
        });
    }

    const datosCliente = {
        ci_nit: parseInt(ci_nit),
        nombre,
        apellido,
        correo: correo || null,
        usuarioA: ciempleado
    };

    console.log('[CLIENTE] Creando cliente:', JSON.stringify(datosCliente, null, 2));

    servicios.crearCliente(datosCliente, (err, resultado) => {
        if (err) {
            console.error('[CLIENTE] Error:', err.message);
            return res.status(500).json({ error: err.message });
        }

        console.log('[CLIENTE] Cliente creado exitosamente:', resultado);
        res.status(201).json({ 
            mensaje: 'Cliente registrado exitosamente',
            cliente: resultado
        });
    });
};

/**
 * Obtener lista de clientes
 */
const obtenerClientes = (req, res) => {
    servicios.obtenerClientes((err, clientes) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({ 
            mensaje: 'Clientes obtenidos exitosamente',
            clientes 
        });
    });
};

/**
 * Obtener cliente por ID
 */
const obtenerClientePorId = (req, res) => {
    const { id } = req.params;

    servicios.obtenerClientePorId(id, (err, cliente) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        
        res.json({ 
            mensaje: 'Cliente obtenido exitosamente',
            cliente
        });
    });
};

/**
 * Actualizar cliente
 */
const actualizarCliente = (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo } = req.body;

    if (!nombre && !apellido && !correo) {
        return res.status(400).json({ 
            mensaje: 'Por favor proporciona al menos un campo para actualizar' 
        });
    }

    const datosActualizar = {
        nombre: nombre || null,
        apellido: apellido || null,
        correo: correo || null
    };

    servicios.actualizarCliente(id, datosActualizar, (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({ 
            mensaje: 'Cliente actualizado exitosamente',
            cliente: resultado
        });
    });
};

/**
 * Eliminar cliente
 */
const eliminarCliente = (req, res) => {
    const { id } = req.params;

    servicios.eliminarCliente(id, (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({ 
            mensaje: 'Cliente eliminado exitosamente',
            resultado
        });
    });
};

module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente
};
