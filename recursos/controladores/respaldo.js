const servicioRespaldo = require('../servicios/respaldo');

/**
 * Crea una copia de seguridad de la base de datos
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

        // Configurar headers para descargar el archivo
        const fechaHora = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const nombreArchivo = `kirkmark-backup-${fechaHora}.sql`;

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
