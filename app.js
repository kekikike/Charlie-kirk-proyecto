/**
 * Servidor Principal - KIRKMARK
 * Punto de entrada de la aplicación
 */

require('dotenv').config();
const app = require('./recursos/ruta/app.js');
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  KIRKMARK - Sistema de Gestión de Ventas`);
    console.log(`  Servidor ejecutándose en puerto ${PORT}`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`${'='.repeat(60)}\n`);
});

// Manejo de errores del servidor
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\nError: Puerto ${PORT} ya está en uso`);
        process.exit(1);
    } else {
        console.error('Error del servidor:', err);
        process.exit(1);
    }
});

// Manejo de señales para shutdown graceful
process.on('SIGTERM', () => {
    console.log('\nServidor terminado por SIGTERM');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nServidor detenido por el usuario');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});
