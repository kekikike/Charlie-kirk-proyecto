const { spawn } = require('child_process');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

/**
 * Genera un respaldo completo de la base de datos usando mysqldump
 * @param {string} backupPath - Ruta donde se guardará el archivo SQL
 */
function obtenerRespaldoDB(backupPath) {
    return new Promise((resolve, reject) => {
        const mysqldumpPath = 'C:\\Program Files\\MySQL\\MySQL Server 9.0\\bin\\mysqldump.exe';
        const user = 'root';
        const password = 'cc++4kglt';
        const database = 'kirkmark';

        if (!fs.existsSync(path.dirname(backupPath))) {
            fs.mkdirSync(path.dirname(backupPath), { recursive: true });
        }

        const dump = spawn(mysqldumpPath, [`-u${user}`, `-p${password}`, database]);

        const fileStream = fs.createWriteStream(backupPath);
        dump.stdout.pipe(fileStream);

        let errorData = '';
        dump.stderr.on('data', data => {
            errorData += data.toString();
        });

        dump.on('close', code => {
            if (code !== 0) {
                return reject(new Error('Error al generar respaldo: ' + errorData));
            }
            resolve(backupPath);
        });
    });
}

/**
 * Restaura la base de datos desde un archivo SQL
 * @param {string} rutaArchivo - Archivo SQL con el respaldo
 */
function restaurarRespaldoDB(rutaArchivo) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(rutaArchivo)) {
            return reject(new Error('El archivo de respaldo no existe'));
        }

        const mysqlPath = 'C:\\Program Files\\MySQL\\MySQL Server 9.0\\bin\\mysql.exe';
        const user = 'root';
        const password = 'cc++4kglt';
        const database = 'kirkmark';

        // Evitamos la redirección < y pasamos el archivo directamente al stdin
        const proceso = spawn(mysqlPath, [`-u${user}`, `-p${password}`, database]);

        const readStream = fs.createReadStream(rutaArchivo);
        readStream.pipe(proceso.stdin);

        let errorData = '';
        proceso.stderr.on('data', data => {
            errorData += data.toString();
        });

        proceso.on('close', code => {
            if (code !== 0) {
                return reject(new Error('Error al restaurar la base: ' + errorData));
            }
            resolve({ success: true, mensaje: 'Base de datos restaurada correctamente' });
        });
    });
}

/**
 * Cron: respaldo automático cada viernes a las 00:00
 * Guarda en ../backups
 */
cron.schedule('0 0 * * 5', async () => {
    console.log('[RESPALDO AUTOMÁTICO] Iniciando...');
    try {
        const backupDir = path.join(__dirname, '../backups');
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

        const backupPath = path.join(
            backupDir,
            `respaldo_kirkmark_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`
        );
        await obtenerRespaldoDB(backupPath);
        console.log('[RESPALDO AUTOMÁTICO] Guardado en', backupPath);
    } catch (err) {
        console.error('[RESPALDO AUTOMÁTICO] Error:', err.message);
    }
});

module.exports = {
    obtenerRespaldoDB,
    restaurarRespaldoDB
};
