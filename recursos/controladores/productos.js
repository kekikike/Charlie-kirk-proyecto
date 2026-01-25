/**
 * Controlador de Productos
 */

const servicios = require('../servicios/productos.js');
const serviciosInventario = require('../servicios/inventario.js');

/**
 * Obtener lista de categorías
 */
const obtenerCategorias = (req, res) => {
    servicios.obtenerCategorias((err, categorias) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({ 
            mensaje: 'Categorías obtenidas exitosamente',
            categorias 
        });
    });
};


const obtenerProductos = (req, res) => {
    servicios.obtenerProductos((err, productos) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({ 
            mensaje: 'Productos obtenidos exitosamente',
            productos 
        });
    });
};

/**
 * Crear nuevo producto
 */
const crearProducto = (req, res) => {
    const { ciempleado } = req.usuario;
    const { nombre, idcategoria, preciounitario } = req.body;

    // Validaciones
    if (!nombre || !idcategoria || !preciounitario) {
        return res.status(400).json({ 
            mensaje: 'Por favor proporciona: nombre, idcategoria y preciounitario' 
        });
    }

    // Obtener próximo código
    servicios.obtenerProximoCodigoProducto((err, codproducto) => {
        if (err) return res.status(500).json({ error: err.message });

        const datosProducto = {
            codproducto,
            nombre,
            idcategoria: parseInt(idcategoria),
            preciounitario: parseFloat(preciounitario),
            usuarioA: ciempleado
        };

        servicios.crearProducto(datosProducto, (err, resultado) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({ 
                mensaje: 'Producto creado exitosamente',
                producto: resultado
            });
        });
    });
};

/**
 * Actualizar producto
 */
const actualizarProducto = (req, res) => {
    const { ciempleado } = req.usuario;
    const { codproducto } = req.params;
    const { nombre, idcategoria, preciounitario } = req.body;

    if (!nombre || !idcategoria || !preciounitario) {
        return res.status(400).json({ 
            mensaje: 'Por favor proporciona: nombre, idcategoria y preciounitario' 
        });
    }

    const datos = {
        nombre,
        idcategoria: parseInt(idcategoria),
        preciounitario: parseFloat(preciounitario)
    };

    servicios.actualizarProducto(codproducto, datos, (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ 
            mensaje: 'Producto actualizado exitosamente',
            producto: resultado
        });
    });
};


const desactivarProducto = (req, res) => {
    const { codproducto } = req.params;

    servicios.desactivarProducto(codproducto, (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ 
            mensaje: 'Producto desactivado exitosamente',
            producto: resultado
        });
    });
};


const activarProducto = (req, res) => {
    const { codproducto } = req.params;
    console.log(`[CONTROLADOR] Activando producto: ${codproducto}`);

    servicios.activarProducto(codproducto, (err, resultado) => {
        if (err) {
            console.error(`[CONTROLADOR] Error al activar: ${err.message}`);
            return res.status(500).json({ error: err.message });
        }

        console.log(`[CONTROLADOR] Producto activado: ${JSON.stringify(resultado)}`);
        res.json({ 
            mensaje: 'Producto activado exitosamente',
            producto: resultado
        });
    });
};


const eliminarProducto = (req, res) => {
    const { codproducto } = req.params;

    serviciosInventario.contarLotesProducto(codproducto, (err, cantidad) => {
        if (err) return res.status(500).json({ error: err.message });

        if (cantidad > 0) {
            return res.status(400).json({ 
                error: `No se puede eliminar el producto. Tiene ${cantidad} lote(s) asociado(s). Primero debe eliminar todos los lotes del producto.` 
            });
        }

        servicios.eliminarProducto(codproducto, (err, resultado) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ 
                mensaje: 'Producto eliminado exitosamente',
                producto: resultado
            });
        });
    });
};

module.exports = {
    obtenerCategorias,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    desactivarProducto,
    activarProducto,
    eliminarProducto
};
