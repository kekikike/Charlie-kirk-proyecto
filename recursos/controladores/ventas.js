/**
 * Controlador de Ventas
 */

const servicios = require('../servicios/ventas.js');

/**
 * Crear una nueva venta
 */
const crearVenta = (req, res) => {
    const { ciempleado } = req.usuario;
    const { subtotal, total, idmetodo, ci_nit, detalles } = req.body;

    // Validaciones
    if (!subtotal || !total || !idmetodo || !detalles || detalles.length === 0) {
        return res.status(400).json({ 
            mensaje: 'Por favor proporciona: subtotal, total, idmetodo y detalles' 
        });
    }

    const datosVenta = {
        ciempleado,
        subtotal: parseFloat(subtotal),
        total: parseFloat(total),
        idmetodo: parseInt(idmetodo),
        ci_nit: ci_nit ? parseInt(ci_nit) : null,
        detalles: detalles.map(d => ({
            codproducto: d.codproducto,
            cantidad: parseInt(d.cantidad),
            preciounitario: parseFloat(d.preciounitario),
            subtotal: parseFloat(d.subtotal)
        }))
    };

    console.log('[VENTA] Creando venta:', JSON.stringify(datosVenta, null, 2));

    servicios.crearVenta(datosVenta, (err, resultado) => {
        if (err) {
            console.error('[VENTA] Error:', err.message);
            return res.status(500).json({ error: err.message });
        }

        console.log('[VENTA] Venta creada exitosamente:', resultado);
        res.status(201).json({ 
            mensaje: 'Venta registrada exitosamente',
            venta: resultado
        });
    });
};

/**
 * Obtener lista de ventas
 */
const obtenerVentas = (req, res) => {
    servicios.obtenerVentas((err, ventas) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({ 
            mensaje: 'Ventas obtenidas exitosamente',
            ventas 
        });
    });
};

/**
 * Obtener detalles de una venta
 */
const obtenerDetallesVenta = (req, res) => {
    const { idventa } = req.params;

    servicios.obtenerDetallesVenta(idventa, (err, detalles) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({ 
            mensaje: 'Detalles obtenidos exitosamente',
            detalles
        });
    });
};

/**
 * Obtener métodos de pago
 */
const obtenerMetodosPago = (req, res) => {
    servicios.obtenerMetodosPago((err, metodos) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({ 
            mensaje: 'Métodos de pago obtenidos exitosamente',
            metodos 
        });
    });
};

module.exports = {
    crearVenta,
    obtenerVentas,
    obtenerDetallesVenta,
    obtenerMetodosPago
};
