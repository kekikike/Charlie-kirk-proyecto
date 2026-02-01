const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '../logs/acciones.log');

function registrarLog({ usuario, accion, detalle = '' }) {
    const fecha = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const linea = `[${fecha}] Usuario: ${usuario} | Acción: ${accion} | ${detalle}\n`;

    fs.appendFile(logPath, linea, (err) => {
        if (err) {
            console.error('Error escribiendo log:', err.message);
        }
    });
}

module.exports = { registrarLog };
