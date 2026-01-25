/**
 * Controlador de Inventario
 */

const servicios = require('../servicios/inventario.js');

/**
 * Obtener inventario completo
 */
const obtenerInventario = (req, res) => {
    const { codproducto } = req.query;
    
    if (codproducto) {
        // Filtrar por producto si se proporciona
        servicios.obtenerInventarioPorProducto(codproducto, (err, lotes) => {
            if (err) return res.status(500).json({ error: err.message });
            
            res.json({ 
                mensaje: 'Inventario del producto obtenido exitosamente',
                lotes 
            });
        });
    } else {
        // Obtener todo el inventario
        servicios.obtenerInventario((err, lotes) => {
            if (err) return res.status(500).json({ error: err.message });
            
            res.json({ 
                mensaje: 'Inventario obtenido exitosamente',
                lotes 
            });
        });
    }
};

/**
 * Obtener inventario por producto
 */
const obtenerInventarioPorProducto = (req, res) => {
    const { codproducto } = req.params;

    servicios.obtenerInventarioPorProducto(codproducto, (err, lotes) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({ 
            mensaje: 'Inventario del producto obtenido exitosamente',
            lotes 
        });
    });
};

/**
 * Crear nuevo lote de inventario
 */
const crearInventario = (req, res) => {
    const { ciempleado } = req.usuario;
    const { codproducto, stock, fechavencimiento, fechaingreso } = req.body;

    if (!codproducto || stock === undefined || !fechaingreso) {
        return res.status(400).json({ 
            mensaje: 'Por favor proporciona: codproducto, stock, fechaingreso' 
        });
    }

    servicios.obtenerProximoCodigoInventario((err, codinventario) => {
        if (err) return res.status(500).json({ error: err.message });

        const datosInventario = {
            codinventario,
            codproducto,
            stock: parseInt(stock),
            fechavencimiento: fechavencimiento || null,
            fechaingreso,
            usuarioA: ciempleado
        };

        servicios.crearInventario(datosInventario, (err, resultado) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({ 
                mensaje: 'Lote de inventario creado exitosamente',
                lote: resultado
            });
        });
    });
};

/**
 * Actualizar stock
 */
const actualizarStock = (req, res) => {
    const { codinventario } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
        return res.status(400).json({ 
            mensaje: 'Por favor proporciona el stock a actualizar' 
        });
    }

    servicios.actualizarStock(codinventario, parseInt(stock), (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ 
            mensaje: 'Stock actualizado exitosamente',
            lote: resultado
        });
    });
};

/**
 * Marcar lote como vencido
 */
const marcarVencido = (req, res) => {
    const { codinventario } = req.params;

    servicios.marcarVencido(codinventario, (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ 
            mensaje: 'Lote marcado como vencido exitosamente',
            lote: resultado
        });
    });
};

/**
 * Eliminar lote
 */
const eliminarInventario = (req, res) => {
    const { codinventario } = req.params;

    servicios.eliminarInventario(codinventario, (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ 
            mensaje: 'Lote eliminado exitosamente',
            lote: resultado
        });
    });
};

module.exports = {
    obtenerInventario,
    obtenerInventarioPorProducto,
    crearInventario,
    actualizarStock,
    marcarVencido,
    eliminarInventario
};
