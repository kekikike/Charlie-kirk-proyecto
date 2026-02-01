const servicioRespaldo = require('../servicios/respaldo');
const fs = require('fs');
const path = require('path');

/**
 * Crea una copia de seguridad de la base de datos
 * Guarda en ../backups y también permite descarga desde el dashboard
 */
async function crearRespaldo(req, res) {
    try {
        // Verificar que sea administrador
        if (req.usuario.rol !== 1) {
            return res.status(403).json({
                success: false,
                error: 'Solo los administradores pueden crear respaldos'
            });
        }

        // Obtener el respaldo de la base de datos
        const contenidoSQL = await servicioRespaldo.obtenerRespaldoDB();

        if (!contenidoSQL) {
            return res.status(500).json({
                success: false,
                error: 'No se pudo generar el respaldo'
            });
        }

        // Guardar automáticamente en ../backups
        const backupDir = path.join(__dirname, '../backups');
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

        const backupPath = path.join(backupDir, `kirkmark-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.sql`);
        fs.writeFileSync(backupPath, contenidoSQL);
        console.log('[RESPALDO MANUAL] Guardado en', backupPath);

        // Configurar headers para descargar el archivo
        const nombreArchivo = path.basename(backupPath);
        res.setHeader('Content-Type', 'application/sql');
        res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
        res.setHeader('Content-Length', Buffer.byteLength(contenidoSQL));

        // Enviar el contenido
        res.send(contenidoSQL);

    } catch (error) {
        console.error('[RESPALDO] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error al crear respaldo'
        });
    }
}

module.exports = {
    crearRespaldo
};
