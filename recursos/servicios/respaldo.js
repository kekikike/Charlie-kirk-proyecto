const { exec } = require('child_process');

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

module.exports = {
    obtenerRespaldoDB
};