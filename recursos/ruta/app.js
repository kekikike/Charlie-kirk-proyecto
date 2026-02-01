const express = require('express');
const path = require('path');
const app = express();
const db = require('../config/conexion.js');
const rutasAutenticacion = require('./autenticacion.js');
const rutasProductos = require('./productos.js');
const rutasInventario = require('./inventario.js');
const rutasVentas = require('./ventas.js');
const rutasClientes = require('./clientes.js');
const rutasRespaldo = require('./respaldo.js');
const rutasLogs = require('./log.js'); 
const { verificarToken } = require('../middleware/autenticacion.js');

// Configurar CORS para permitir peticiones desde el frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Rutas de autenticación
app.use('/api/auth', rutasAutenticacion);

// Rutas de productos
app.use('/api/productos', rutasProductos);

// Rutas de inventario
app.use('/api/inventario', rutasInventario);

// Rutas de ventas
app.use('/api/ventas', rutasVentas);

// Rutas de clientes
app.use('/api/clientes', rutasClientes);

// Rutas de respaldo
app.use('/api/respaldo', rutasRespaldo);

// Rutas públicas
app.get('/empleados', (req, res) => {
    db.query('SELECT * FROM templeados', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Ruta raíz - servir login si no está autenticado, dashboard si está autenticado
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/login.html'));
});

// Rutas protegidas (requieren token)
app.get('/empleados/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM templeados WHERE ciempleado = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
        res.json(results[0]);
    });
});


app.use('/api', rutasLogs); 

module.exports = app;