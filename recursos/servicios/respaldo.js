const { exec } = require('child_process');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

/**
 * Genera un respaldo completo de la base de datos usando mysqldump
 */
async function obtenerRespaldoDB() {
    return new Promise((resolve, reject) => {
        const user = 'root';
        const password = '252005';
        const database = 'kirkmark';
        
        // Intentar encontrar mysqldump en ubicaciones comunes
        const paths = [
            'C:\\xampp\\mysql\\bin\\mysqldump.exe',
            'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
            'C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysqldump.exe',
            'C:\\Program Files\\MySQL\\MySQL Server 9.0\\bin\\mysqldump.exe',
            'mysqldump' // si está en el PATH
        ];

        let mysqldumpPath = paths[0]; // Por defecto XAMPP
        
        const comando = `"${mysqldumpPath}" -u ${user} -p${password} ${database}`;

        console.log('[RESPALDO] Ejecutando mysqldump...');
        exec(comando, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
            if (error) {
                console.error('[RESPALDO] Error:', stderr || error.message);
                return reject(new Error('No se pudo generar el respaldo'));
            }

            if (!stdout || stdout.trim().length === 0) {
                return reject(new Error('El respaldo salió vacío'));
            }

            const fechaHora = new Date().toISOString();
            const header =
`-- Respaldo de la base de datos: ${database}
-- Fecha: ${fechaHora}
--
`;

            console.log('[RESPALDO] Respaldo generado correctamente');
            resolve(header + stdout);
        });
    });
}

/**
 * Restaura la base de datos desde un archivo SQL
 */
async function restaurarRespaldoDB(rutaArchivo) {
    return new Promise((resolve, reject) => {
        // Verificar que el archivo existe
        if (!fs.existsSync(rutaArchivo)) {
            return reject(new Error('El archivo de respaldo no existe'));
        }

        const user = 'root';
        const password = '252005';
        const database = 'kirkmark';
        
        // Ubicaciones posibles de mysql
        const paths = [
            'C:\\xampp\\mysql\\bin\\mysql.exe',
            'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe',
            'C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysql.exe',
            'C:\\Program Files\\MySQL\\MySQL Server 9.0\\bin\\mysql.exe',
            'mysql'
        ];

        let mysqlPath = paths[0];
        
        // Leer el contenido del archivo
        const contenidoSQL = fs.readFileSync(rutaArchivo, 'utf8');
        
        // Comando para restaurar
        const comando = `"${mysqlPath}" -u ${user} -p${password} ${database}`;

        console.log('[RESTAURACIÓN] Ejecutando restauración desde', rutaArchivo);
        
        const proceso = exec(comando, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
            if (error) {
                console.error('[RESTAURACIÓN] Error:', stderr || error.message);
                return reject(new Error('No se pudo restaurar la base de datos: ' + (stderr || error.message)));
            }

            console.log('[RESTAURACIÓN] Base de datos restaurada correctamente');
            resolve({ success: true, mensaje: 'Base de datos restaurada correctamente' });
        });

        // Enviar el contenido SQL al stdin del proceso
        proceso.stdin.write(contenidoSQL);
        proceso.stdin.end();
    });
}

/**
 * Cron: respaldo automático cada viernes a las 00:00
 * Guarda en ../backups
 */
cron.schedule('0 0 * * 5', async () => {
    console.log('[RESPALDO AUTOMÁTICO] Iniciando...');
    try {
        const respaldo = await obtenerRespaldoDB();
        const backupDir = path.join(__dirname, '../backups');
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

        const backupPath = path.join(backupDir, `respaldo_kirkmark_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`);
        fs.writeFileSync(backupPath, respaldo);
        console.log('[RESPALDO AUTOMÁTICO] Guardado en', backupPath);
    } catch (err) {
        console.error('[RESPALDO AUTOMÁTICO] Error:', err.message);
    }
});

module.exports = {
    obtenerRespaldoDB,
    restaurarRespaldoDB
};
