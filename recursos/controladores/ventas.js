/**
 * Controlador de Ventas
 */

// Al principio del archivo, importa el servicio de PDF que creaste
const pdfServicio = require('../servicios/pdfServicio.js');
const db = require('../config/conexion.js');
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


const generarTicket = (req, res) => {
    const datosVenta = req.body;
    const ciEmpleado = req.usuario.ciempleado;
    const idMetodo = datosVenta.idmetodo; // Viene del frontend

    // 1. Buscamos el nombre del empleado
    db.query('SELECT nombre1, apellido1 FROM templeados WHERE ciempleado = ?', [ciEmpleado], (err, rowsEmp) => {
        if (err) {
            datosVenta.empleadoNombre = "Vendedor";
        } else {
            const emp = rowsEmp[0];
            datosVenta.empleadoNombre = emp ? `${emp.nombre1} ${emp.apellido1 || ''}`.trim() : "Vendedor";
        }

        // 2. Buscamos el nombre del método de pago
        db.query('SELECT nombre FROM tmetodopago WHERE idmetodo = ?', [idMetodo], (err, rowsMet) => {
            if (err || rowsMet.length === 0) {
                datosVenta.metodoNombre = "No especificado";
            } else {
                datosVenta.metodoNombre = rowsMet[0].nombre;
            }

            // 3. Ya con todo, generamos el PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=ticket.pdf');
            pdfServicio.generarTicketPDF(datosVenta, res);
        });
    });
};
module.exports = {
    crearVenta,
    obtenerVentas,
    obtenerDetallesVenta,
    obtenerMetodosPago,
    generarTicket // <--- Nueva
};