CREATE DATABASE kirkmark;
USE kirkmark;

CREATE TABLE troles (
    idrol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BIT DEFAULT 1,
    usuarioA INT
) ENGINE=InnoDB;

CREATE TABLE templeados (
    ciempleado INT PRIMARY KEY,
    nombre1 VARCHAR(100),
    nombre2 VARCHAR(100),
    apellido1 VARCHAR(100),
    apellido2 VARCHAR(100),
    fechanac DATE,
    sexo BIT,
    correo VARCHAR(150),
    contraseña varchar(200),
    telefono INT,
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BIT DEFAULT 1,
    rol int,
    usuarioA INT,
    CONSTRAINT fk_templeados_usuarioA
        FOREIGN KEY (usuarioA) REFERENCES templeados(ciempleado),
	CONSTRAINT fk_templeados_rol
		foreign key (rol) references troles (idrol)
) ENGINE=InnoDB;



CREATE TABLE tcategorias (
    idcategoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BIT DEFAULT 1,
    usuarioA INT,
    CONSTRAINT fk_tcategorias_usuarioA
        FOREIGN KEY (usuarioA) REFERENCES templeados(ciempleado)
) ENGINE=InnoDB;

CREATE TABLE tproductos (
    codproducto VARCHAR(10) PRIMARY KEY,
    idcategoria INT,
    nombre VARCHAR(100),
    preciounitario DECIMAL(10,2),
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BIT DEFAULT 1,
    usuarioA INT,
    CONSTRAINT fk_tproductos_usuarioA
        FOREIGN KEY (usuarioA) REFERENCES templeados(ciempleado),
    CONSTRAINT fk_tproductos_categoria
        FOREIGN KEY (idcategoria) REFERENCES tcategorias(idcategoria)
) ENGINE=InnoDB;

CREATE TABLE tinventario (
    codinventario VARCHAR(20) PRIMARY KEY,
    codproducto VARCHAR(10),
    stock INT,
    fechavencimiento DATE,
    fechaingreso DATE,
    fechasalida DATE,
    estadolote BIT,
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BIT DEFAULT 1,
    usuarioA INT,
    CONSTRAINT fk_tinventario_usuarioA
        FOREIGN KEY (usuarioA) REFERENCES templeados(ciempleado),
    CONSTRAINT fk_tinventario_producto
        FOREIGN KEY (codproducto) REFERENCES tproductos(codproducto)
) ENGINE=InnoDB;

CREATE TABLE tclientes (
    ci_nit INT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    correo VARCHAR(200),
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BIT DEFAULT 1,
    usuarioA INT,
    CONSTRAINT fk_tclientes_usuarioA
        FOREIGN KEY (usuarioA) REFERENCES templeados(ciempleado)
) ENGINE=InnoDB;

CREATE TABLE tmetodopago (
    idmetodo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BIT DEFAULT 1,
    usuarioA INT,
    CONSTRAINT fk_tmetodopago_usuarioA
        FOREIGN KEY (usuarioA) REFERENCES templeados(ciempleado)
) ENGINE=InnoDB;

CREATE TABLE tventas (
    idventa INT AUTO_INCREMENT PRIMARY KEY,
    ci_nit INT,
    ciempleado INT,
    idmetodo INT,
    fechaventa DATE,
    hora TIME,
    subtotal DECIMAL(10,2),
    descuento DECIMAL(10,2) DEFAULT 0.00,
    iva DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2),
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BIT DEFAULT 1,
    usuarioA INT,
    CONSTRAINT fk_tventas_usuarioA
        FOREIGN KEY (usuarioA) REFERENCES templeados(ciempleado),
    CONSTRAINT fk_tventas_empleado
        FOREIGN KEY (ciempleado) REFERENCES templeados(ciempleado),
    CONSTRAINT fk_tventas_metodo
        FOREIGN KEY (idmetodo) REFERENCES tmetodopago(idmetodo)
) ENGINE=InnoDB;

CREATE TABLE tdetalleventa (
    iddetalle INT AUTO_INCREMENT PRIMARY KEY,
    idventa INT,
    codproducto VARCHAR(10),
    cantidad INT,
    preciounitario DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    fecharegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BIT DEFAULT 1,
    usuarioA INT,
    CONSTRAINT fk_tdetalleventa_usuarioA
        FOREIGN KEY (usuarioA) REFERENCES templeados(ciempleado),
    CONSTRAINT fk_tdetalleventa_venta
        FOREIGN KEY (idventa) REFERENCES tventas(idventa),
    CONSTRAINT fk_tdetalleventa_producto
        FOREIGN KEY (codproducto) REFERENCES tproductos(codproducto)
) ENGINE=InnoDB;

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
        
INSERT INTO troles (
    nombre,
    descripcion,
    estado,
    usuarioA
) VALUES
('Administrador', 'Control total del sistema, permisos absolutos y cero culpa', 1, 1),
('Vendedor', 'Vende cosas, cobra mal y culpa al sistema', 1, 1);

INSERT INTO templeados (
    ciempleado,
    nombre1,
    nombre2,
    apellido1,
    apellido2,
    fechanac,
    sexo,
    correo,
    contraseña,
    telefono,
    estado,
    rol,
    usuarioA
) VALUES (
    1,
    'Williams',
    'Joel',
    'Barbaito',
    'Paco',
    '2005-02-25',
    1,
    "willibarb2502@gmail.com",
    "$2b$10$QBKj63wzEeBwT3JoRsf2OuEyemlVkTTlNYyv9OXl7WCFKh70Dekuq",
    71216858,
    1,
    1,
    NULL
);

INSERT INTO tcategorias (
    nombre,
    descripcion,
    estado,
    usuarioA
) VALUES
('Bebidas', 'Bebidas frías y calientes', 1, 1),
('Comidas', 'Alimentos variados', 1, 1),
('Snacks', 'Snacks y aperitivos', 1, 1),
('Lácteos', 'Productos lácteos y derivados', 1, 1),
('Abarrotes', 'Abarrotes y productos secos', 1, 1);

INSERT INTO tmetodopago (
    nombre,
    descripcion,
    estado,
    usuarioA
) VALUES
('Efectivo', 'Pago en efectivo', 1, 1),
('Tarjeta Débito', 'Pago con tarjeta de débito', 1, 1),
('Tarjeta Crédito', 'Pago con tarjeta de crédito', 1, 1);

select * from templeados