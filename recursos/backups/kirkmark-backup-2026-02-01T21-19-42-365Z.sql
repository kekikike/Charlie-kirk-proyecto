-- Respaldo de la base de datos: kirkmark
-- Fecha: 2026-02-01T21:19:42.364Z
--
-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: kirkmark
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tcategorias`
--

DROP TABLE IF EXISTS `tcategorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tcategorias` (
  `idcategoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `fecharegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` bit(1) DEFAULT b'1',
  `usuarioA` int DEFAULT NULL,
  PRIMARY KEY (`idcategoria`),
  KEY `fk_tcategorias_usuarioA` (`usuarioA`),
  CONSTRAINT `fk_tcategorias_usuarioA` FOREIGN KEY (`usuarioA`) REFERENCES `templeados` (`ciempleado`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tcategorias`
--

LOCK TABLES `tcategorias` WRITE;
/*!40000 ALTER TABLE `tcategorias` DISABLE KEYS */;
INSERT INTO `tcategorias` VALUES (1,'Bebidas','Bebidas frías y calientes','2026-02-01 14:17:12','',1),(2,'Comidas','Alimentos variados','2026-02-01 14:17:12','',1),(3,'Snacks','Snacks y aperitivos','2026-02-01 14:17:12','',1),(4,'Lácteos','Productos lácteos y derivados','2026-02-01 14:17:12','',1),(5,'Abarrotes','Abarrotes y productos secos','2026-02-01 14:17:12','',1);
/*!40000 ALTER TABLE `tcategorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tclientes`
--

DROP TABLE IF EXISTS `tclientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tclientes` (
  `ci_nit` int NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `correo` varchar(200) DEFAULT NULL,
  `fecharegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` bit(1) DEFAULT b'1',
  `usuarioA` int DEFAULT NULL,
  `ci_nit_enc` longtext COMMENT 'CI/NIT encriptado con AES-256-CBC',
  `telefono` varchar(20) DEFAULT NULL COMMENT 'Teléfono sin encriptar (para búsqueda)',
  `telefono_enc` longtext COMMENT 'Teléfono encriptado con AES-256-CBC',
  PRIMARY KEY (`ci_nit`),
  KEY `fk_tclientes_usuarioA` (`usuarioA`),
  CONSTRAINT `fk_tclientes_usuarioA` FOREIGN KEY (`usuarioA`) REFERENCES `templeados` (`ciempleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tclientes`
--

LOCK TABLES `tclientes` WRITE;
/*!40000 ALTER TABLE `tclientes` DISABLE KEYS */;
INSERT INTO `tclientes` VALUES (111,'swadaw','wasdaws','wqsdwa@gmail.com','2026-02-01 16:12:40','',1,'9d5536b6460f07a5f3b4734e96a3ee43',NULL,NULL),(6986837,'Favioo','Favcio','Favio@gmail.com','2026-02-01 14:18:16','',1,'6d85fce4cb4a527e25e8e9dade932c74',NULL,NULL),(12345666,'Favioo','favv','Favi4o@gmail.com','2026-02-01 15:03:51','',2,'bc9cd8fc53cb7cf77bc6922a80cbab28',NULL,NULL);
/*!40000 ALTER TABLE `tclientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tdetalleventa`
--

DROP TABLE IF EXISTS `tdetalleventa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tdetalleventa` (
  `iddetalle` int NOT NULL AUTO_INCREMENT,
  `idventa` int DEFAULT NULL,
  `codproducto` varchar(10) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `preciounitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `fecharegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` bit(1) DEFAULT b'1',
  `usuarioA` int DEFAULT NULL,
  PRIMARY KEY (`iddetalle`),
  KEY `fk_tdetalleventa_usuarioA` (`usuarioA`),
  KEY `fk_tdetalleventa_venta` (`idventa`),
  KEY `fk_tdetalleventa_producto` (`codproducto`),
  CONSTRAINT `fk_tdetalleventa_producto` FOREIGN KEY (`codproducto`) REFERENCES `tproductos` (`codproducto`),
  CONSTRAINT `fk_tdetalleventa_usuarioA` FOREIGN KEY (`usuarioA`) REFERENCES `templeados` (`ciempleado`),
  CONSTRAINT `fk_tdetalleventa_venta` FOREIGN KEY (`idventa`) REFERENCES `tventas` (`idventa`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tdetalleventa`
--

LOCK TABLES `tdetalleventa` WRITE;
/*!40000 ALTER TABLE `tdetalleventa` DISABLE KEYS */;
INSERT INTO `tdetalleventa` VALUES (1,1,'PROD001',2,5.00,10.00,'2026-02-01 14:19:11','',1),(2,2,'PROD001',3,5.00,15.00,'2026-02-01 15:04:52','',2),(3,3,'PROD001',4,5.00,20.00,'2026-02-01 16:12:07','',1),(4,4,'PROD001',7,5.00,35.00,'2026-02-01 16:24:38','',1),(5,5,'PROD001',4,5.00,20.00,'2026-02-01 16:28:43','',1);
/*!40000 ALTER TABLE `tdetalleventa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `templeados`
--

DROP TABLE IF EXISTS `templeados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `templeados` (
  `ciempleado` int NOT NULL,
  `nombre1` varchar(100) DEFAULT NULL,
  `nombre2` varchar(100) DEFAULT NULL,
  `apellido1` varchar(100) DEFAULT NULL,
  `apellido2` varchar(100) DEFAULT NULL,
  `fechanac` date DEFAULT NULL,
  `sexo` bit(1) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `contraseña` varchar(200) DEFAULT NULL,
  `telefono` int DEFAULT NULL,
  `fecharegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` bit(1) DEFAULT b'1',
  `rol` int DEFAULT NULL,
  `usuarioA` int DEFAULT NULL,
  `ciempleado_enc` longtext COMMENT 'CI Empleado encriptado con AES-256-CBC',
  `correo_enc` longtext COMMENT 'Correo encriptado con AES-256-CBC',
  `telefono_enc` longtext COMMENT 'Teléfono encriptado con AES-256-CBC',
  PRIMARY KEY (`ciempleado`),
  KEY `fk_templeados_usuarioA` (`usuarioA`),
  KEY `fk_templeados_rol` (`rol`),
  CONSTRAINT `fk_templeados_rol` FOREIGN KEY (`rol`) REFERENCES `troles` (`idrol`),
  CONSTRAINT `fk_templeados_usuarioA` FOREIGN KEY (`usuarioA`) REFERENCES `templeados` (`ciempleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templeados`
--

LOCK TABLES `templeados` WRITE;
/*!40000 ALTER TABLE `templeados` DISABLE KEYS */;
INSERT INTO `templeados` VALUES (1,'Williams','Joel','Barbaito','Paco','2005-02-25','','willibarb2502@gmail.com','$2b$10$QBKj63wzEeBwT3JoRsf2OuEyemlVkTTlNYyv9OXl7WCFKh70Dekuq',71216858,'2026-02-01 14:17:12','',1,NULL,NULL,NULL,NULL),(2,'Enrique ','Juan','Escobar','Quenallata','2006-01-20','','kike@gmail.com','$2b$10$tYMsXgaSXbIcHC2ktqHjxOtIAeRiciFAGwviNFyyN7GprbHLE8g1C',1234567899,'2026-02-01 14:20:22','',2,1,NULL,'a21a556e3f560e3403ac629b54ff73b3','e5b51b04280054cbec0f494b8a627337');
/*!40000 ALTER TABLE `templeados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tinventario`
--

DROP TABLE IF EXISTS `tinventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tinventario` (
  `codinventario` varchar(20) NOT NULL,
  `codproducto` varchar(10) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `fechavencimiento` date DEFAULT NULL,
  `fechaingreso` date DEFAULT NULL,
  `fechasalida` date DEFAULT NULL,
  `estadolote` bit(1) DEFAULT NULL,
  `fecharegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` bit(1) DEFAULT b'1',
  `usuarioA` int DEFAULT NULL,
  PRIMARY KEY (`codinventario`),
  KEY `fk_tinventario_usuarioA` (`usuarioA`),
  KEY `fk_tinventario_producto` (`codproducto`),
  CONSTRAINT `fk_tinventario_producto` FOREIGN KEY (`codproducto`) REFERENCES `tproductos` (`codproducto`),
  CONSTRAINT `fk_tinventario_usuarioA` FOREIGN KEY (`usuarioA`) REFERENCES `templeados` (`ciempleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tinventario`
--

LOCK TABLES `tinventario` WRITE;
/*!40000 ALTER TABLE `tinventario` DISABLE KEYS */;
INSERT INTO `tinventario` VALUES ('INV00001','PROD001',30,'2026-02-28','2026-01-01',NULL,'','2026-02-01 14:18:51','',1);
/*!40000 ALTER TABLE `tinventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tmetodopago`
--

DROP TABLE IF EXISTS `tmetodopago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tmetodopago` (
  `idmetodo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `fecharegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` bit(1) DEFAULT b'1',
  `usuarioA` int DEFAULT NULL,
  PRIMARY KEY (`idmetodo`),
  KEY `fk_tmetodopago_usuarioA` (`usuarioA`),
  CONSTRAINT `fk_tmetodopago_usuarioA` FOREIGN KEY (`usuarioA`) REFERENCES `templeados` (`ciempleado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tmetodopago`
--

LOCK TABLES `tmetodopago` WRITE;
/*!40000 ALTER TABLE `tmetodopago` DISABLE KEYS */;
INSERT INTO `tmetodopago` VALUES (1,'Efectivo','Pago en efectivo','2026-02-01 14:17:13','',1),(2,'Tarjeta Débito','Pago con tarjeta de débito','2026-02-01 14:17:13','',1),(3,'Tarjeta Crédito','Pago con tarjeta de crédito','2026-02-01 14:17:13','',1);
/*!40000 ALTER TABLE `tmetodopago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tproductos`
--

DROP TABLE IF EXISTS `tproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tproductos` (
  `codproducto` varchar(10) NOT NULL,
  `idcategoria` int DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `preciounitario` decimal(10,2) DEFAULT NULL,
  `fecharegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` bit(1) DEFAULT b'1',
  `usuarioA` int DEFAULT NULL,
  PRIMARY KEY (`codproducto`),
  KEY `fk_tproductos_usuarioA` (`usuarioA`),
  KEY `fk_tproductos_categoria` (`idcategoria`),
  CONSTRAINT `fk_tproductos_categoria` FOREIGN KEY (`idcategoria`) REFERENCES `tcategorias` (`idcategoria`),
  CONSTRAINT `fk_tproductos_usuarioA` FOREIGN KEY (`usuarioA`) REFERENCES `templeados` (`ciempleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tproductos`
--

LOCK TABLES `tproductos` WRITE;
/*!40000 ALTER TABLE `tproductos` DISABLE KEYS */;
INSERT INTO `tproductos` VALUES ('PROD001',1,'Sprite',5.00,'2026-02-01 14:18:30','',1);
/*!40000 ALTER TABLE `tproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `troles`
--

DROP TABLE IF EXISTS `troles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `troles` (
  `idrol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `fecharegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` bit(1) DEFAULT b'1',
  `usuarioA` int DEFAULT NULL,
  PRIMARY KEY (`idrol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `troles`
--

LOCK TABLES `troles` WRITE;
/*!40000 ALTER TABLE `troles` DISABLE KEYS */;
INSERT INTO `troles` VALUES (1,'Administrador','Control total del sistema, permisos absolutos y cero culpa','2026-02-01 14:17:12','',1),(2,'Vendedor','Vende cosas, cobra mal y culpa al sistema','2026-02-01 14:17:12','',1);
/*!40000 ALTER TABLE `troles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tventas`
--

DROP TABLE IF EXISTS `tventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tventas` (
  `idventa` int NOT NULL AUTO_INCREMENT,
  `ci_nit` int DEFAULT NULL,
  `ciempleado` int DEFAULT NULL,
  `idmetodo` int DEFAULT NULL,
  `fechaventa` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT '0.00',
  `iva` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) DEFAULT NULL,
  `fecharegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` bit(1) DEFAULT b'1',
  `usuarioA` int DEFAULT NULL,
  `ci_nit_enc` longtext COMMENT 'CI/NIT del cliente encriptado',
  `ciempleado_enc` longtext COMMENT 'CI/NIT del vendedor encriptado',
  PRIMARY KEY (`idventa`),
  KEY `fk_tventas_usuarioA` (`usuarioA`),
  KEY `fk_tventas_empleado` (`ciempleado`),
  KEY `fk_tventas_metodo` (`idmetodo`),
  CONSTRAINT `fk_tventas_empleado` FOREIGN KEY (`ciempleado`) REFERENCES `templeados` (`ciempleado`),
  CONSTRAINT `fk_tventas_metodo` FOREIGN KEY (`idmetodo`) REFERENCES `tmetodopago` (`idmetodo`),
  CONSTRAINT `fk_tventas_usuarioA` FOREIGN KEY (`usuarioA`) REFERENCES `templeados` (`ciempleado`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tventas`
--

LOCK TABLES `tventas` WRITE;
/*!40000 ALTER TABLE `tventas` DISABLE KEYS */;
INSERT INTO `tventas` VALUES (1,6986837,1,3,'2026-02-01','14:19:11',10.00,0.00,0.00,10.00,'2026-02-01 14:19:11','',1,'6d85fce4cb4a527e25e8e9dade932c74','d478ce47cf59f1dd2bf204f85cc04190'),(2,6986837,2,1,'2026-02-01','15:04:52',15.00,0.00,0.00,15.00,'2026-02-01 15:04:52','',2,'6d85fce4cb4a527e25e8e9dade932c74','e0acf7dd80810cdc3b2d908ac7ca4914'),(3,6986837,1,1,'2026-02-01','16:12:07',20.00,0.00,0.00,20.00,'2026-02-01 16:12:07','',1,'6d85fce4cb4a527e25e8e9dade932c74','d478ce47cf59f1dd2bf204f85cc04190'),(4,6986837,1,1,'2026-02-01','16:24:38',35.00,0.00,0.00,35.00,'2026-02-01 16:24:38','',1,'6d85fce4cb4a527e25e8e9dade932c74','d478ce47cf59f1dd2bf204f85cc04190'),(5,6986837,1,1,'2026-02-01','16:28:43',20.00,0.00,0.00,20.00,'2026-02-01 16:28:43','',1,'6d85fce4cb4a527e25e8e9dade932c74','d478ce47cf59f1dd2bf204f85cc04190');
/*!40000 ALTER TABLE `tventas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-01 17:19:42
