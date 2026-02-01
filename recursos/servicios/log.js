// servicios/log.js
const fs = require('fs');
const path = require('path');

// Ruta donde se guardarán los logs (ajusta si quieres otra carpeta)
const logPath = path.join(__dirname, '../logs/acciones.log');

function registrarLog(usuario, accion, detalle = '') {
    const fecha = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const linea = `[${fecha}] Usuario: ${usuario} | Acción: ${accion} | ${detalle}\n`;

    try {
        fs.appendFileSync(logPath, linea);
        console.log('Log registrado:', linea.trim());
    } catch (err) {
        console.error('Error escribiendo log:', err.message);
    }
}

module.exports = { registrarLog };
