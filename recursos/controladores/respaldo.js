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

/**
 * Restaura la base de datos desde un archivo subido o desde un archivo en backups
 */
async function restaurarRespaldo(req, res) {
    try {
        // Verificar que sea administrador
        if (req.usuario.rol !== 1) {
            return res.status(403).json({
                success: false,
                error: 'Solo los administradores pueden restaurar respaldos'
            });
        }

        const { nombreArchivo } = req.body;

        if (!nombreArchivo) {
            return res.status(400).json({
                success: false,
                error: 'Debe especificar el nombre del archivo a restaurar'
            });
        }

        // Construir la ruta del archivo
        const backupDir = path.join(__dirname, '../backups');
        const rutaCompleta = path.join(backupDir, nombreArchivo);

        // Validar que el archivo está en el directorio de backups (seguridad)
        if (!rutaCompleta.startsWith(backupDir)) {
            return res.status(400).json({
                success: false,
                error: 'Ruta inválida'
            });
        }

        // Restaurar la base de datos
        const resultado = await servicioRespaldo.restaurarRespaldoDB(rutaCompleta);

        return res.status(200).json({
            success: true,
            mensaje: resultado.mensaje
        });

    } catch (error) {
        console.error('[RESTAURACIÓN] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error al restaurar respaldo'
        });
    }
}

/**
 * Lista todos los archivos de backup disponibles
 */
async function listarRespaldos(req, res) {
    try {
        // Verificar que sea administrador
        if (req.usuario.rol !== 1) {
            return res.status(403).json({
                success: false,
                error: 'Solo los administradores pueden ver respaldos'
            });
        }

        const backupDir = path.join(__dirname, '../backups');
        
        if (!fs.existsSync(backupDir)) {
            return res.status(200).json({
                success: true,
                respaldos: []
            });
        }

        const archivos = fs.readdirSync(backupDir).filter(f => f.endsWith('.sql'));
        
        // Obtener información de cada archivo
        const respaldos = archivos.map(archivo => {
            const rutaCompleta = path.join(backupDir, archivo);
            const stats = fs.statSync(rutaCompleta);
            return {
                nombre: archivo,
                tamaño: stats.size,
                tamaño_mb: (stats.size / 1024 / 1024).toFixed(2),
                fechaCreacion: stats.birthtime,
                fechaModificacion: stats.mtime
            };
        }).sort((a, b) => b.fechaModificacion - a.fechaModificacion);

        return res.status(200).json({
            success: true,
            respaldos: respaldos
        });

    } catch (error) {
        console.error('[LISTAR RESPALDOS] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error al listar respaldos'
        });
    }
}

module.exports = {
    crearRespaldo,
    restaurarRespaldo,
    listarRespaldos
};
