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
        const password = 'cc++4kglt';
        const database = 'kirkmark';
        const mysqldumpPath = 'C:\\Program Files\\MySQL\\MySQL Server 9.0\\bin\\mysqldump.exe';
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
    obtenerRespaldoDB
};
