const { exec } = require('child_process');
const path = require('path');

/**
 * Obtiene una copia de seguridad completa de la base de datos
 * Utiliza mysqldump para generar el SQL de exportación
 */
async function obtenerRespaldoDB() {
    return new Promise((resolve, reject) => {
        // Obtener variables de entorno
        const host = process.env.DB_HOST || 'localhost';
        const user = process.env.DB_USER || 'root';
        const password = process.env.DB_PASSWORD || '';
        const database = process.env.DB_NAME || 'kirkmark';

        // Ruta completa a mysqldump (XAMPP installation)
        const mysqldumpPath = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';
        
        // Construir el comando mysqldump
        let comando = `"${mysqldumpPath}"`;
        
        // Agregar credenciales
        if (user) {
            comando += ` -u ${user}`;
        }
        if (password) {
            comando += ` -p${password}`;
        }
        if (host) {
            comando += ` -h ${host}`;
        }
        
        // Agregar opciones de exportación
        comando += ` --default-auth=mysql_native_password --complete-insert --extended-insert=FALSE --add-drop-table --add-drop-database`;
        
        // Especificar la base de datos
        comando += ` ${database}`;

        console.log('[RESPALDO] Ejecutando comando mysqldump...');

        // Ejecutar el comando
        exec(comando, (error, stdout, stderr) => {
            if (error) {
                console.error('[RESPALDO] Error ejecutando mysqldump:', error);
                console.error('[RESPALDO] stderr:', stderr);
                reject(new Error(`Error ejecutando mysqldump: ${error.message}`));
                return;
            }

            if (stderr && stderr.length > 0) {
                // mysqldump a menudo escribe advertencias en stderr, no es necesariamente un error
                console.log('[RESPALDO] Advertencias:', stderr);
            }

            if (!stdout || stdout.length === 0) {
                reject(new Error('No se pudo generar el respaldo: sin contenido SQL'));
                return;
            }

            console.log('[RESPALDO] Respaldo generado exitosamente');
            console.log(`[RESPALDO] Tamaño del respaldo: ${Buffer.byteLength(stdout)} bytes`);
            
            // Agregar comentario de fecha al principio
            const fechaHora = new Date().toISOString();
            const header = `-- Respaldo de base de datos: kirkmark\n-- Fecha: ${fechaHora}\n-- \n\n`;
            
            resolve(header + stdout);
        });
    });
}

module.exports = {
    obtenerRespaldoDB
};
