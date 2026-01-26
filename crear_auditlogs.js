const db = require('./recursos/config/conexion.js');

const crearTablaAudit = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS tauditlogs (
            idaudit INT AUTO_INCREMENT PRIMARY KEY,
            ciempleado INT NOT NULL,
            accion VARCHAR(100) NOT NULL,
            tabla VARCHAR(50),
            registro_id INT,
            datos_anteriores JSON,
            datos_nuevos JSON,
            ip_address VARCHAR(45),
            user_agent VARCHAR(500),
            resultado ENUM('exitoso', 'fallido') DEFAULT 'exitoso',
            detalles_error TEXT,
            fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ciempleado) REFERENCES templeados(ciempleado) ON DELETE CASCADE,
            INDEX idx_fecha (fecharegistro),
            INDEX idx_empleado (ciempleado),
            INDEX idx_accion (accion)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error creando tabla de auditoría:', err);
            return;
        }
        console.log('✓ Tabla tauditlogs creada/verificada exitosamente');
        process.exit(0);
    });
};

crearTablaAudit();
