-- Respaldo de la base de datos: kirkmark
-- Fecha: 2026-02-06T04:00:58.140Z
--
-- MySQL dump 10.13  Distrib 9.0.1, for Win64 (x86_64)
--
-- Host: localhost    Database: kirkmark
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
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
/*!50503 SET character_set_client = utf8mb4 */;
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
INSERT INTO `tcategorias` VALUES (1,'Bebidas','Bebidas frías y calientes','2026-01-25 11:26:02',_binary '',1),(2,'Comidas','Alimentos variados','2026-01-25 11:26:02',_binary '',1),(3,'Snacks','Snacks y aperitivos','2026-01-25 11:26:02',_binary '',1),(4,'Lácteos','Productos lácteos y derivados','2026-01-25 11:26:02',_binary '',1),(5,'Abarrotes','Abarrotes y productos secos','2026-01-25 11:26:02',_binary '',1);
/*!40000 ALTER TABLE `tcategorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tclientes`
--

DROP TABLE IF EXISTS `tclientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tclientes` (
  `ci_nit` int NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `correo` varchar(200) DEFAULT NULL,
  `fecharegistro` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` bit(1) DEFAULT b'1',
  `usuarioA` int DEFAULT NULL,
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
INSERT INTO `tclientes` VALUES (2,'ññ','ññ','nn@gmail.com','2026-01-29 21:04:31',_binary '',1),(3,'pp','pp','pp@gmail.com','2026-01-29 21:05:33',_binary '',1),(12,'ñ','ñ','n@gmail.com','2026-01-29 21:20:43',_binary '',1),(34,'p','p',NULL,'2026-01-29 21:21:56',_binary '',1),(67,'y','y',NULL,'2026-01-29 21:22:23',_binary '',1),(68,'l','l','l@gmail.com','2026-01-29 21:22:33',_binary '',1),(76,'six','seven','seissiete@gmail.com','2026-01-31 16:17:57',_binary '',1),(78,'m','m','m@gmail.com','2026-01-29 21:22:10',_binary '',1),(80,'l','l','l@gmail.com','2026-01-29 21:38:47',_binary '',1),(90,'ñ','ñ','m@gmail.com','2026-01-29 21:38:21',_binary '',1),(123,'qq','qq','qq@gmail.com','2026-01-27 11:32:30',_binary '',1),(901,'2fc27eeaf6f220bf63a3956e92d13b3a:4f72c41ee1c0272d69f95ec26ba9638c','3c48f2f27cba99434eb092ed879da7a7:710570d8143fcac020d40fc91348abdd','b83e518ea11431c66881ed75cfbf3a39:1616047da3b8c9810342572af65aaf70','2026-02-01 11:02:12',_binary '',1),(1234,'ll','ll','ll@gmail.com','2026-01-29 21:03:10',_binary '',1),(124151,'pp','pp','pp@gmail.com','2026-01-26 18:02:00',_binary '',1),(789456,'9eee00a01bfca661b0ddee95c4526def:00828ffcbba7116aac6c81f54265863e','75b2e984fb6a579813fc159afe726c1b:98dddc7654bf527e1ed5ac314afbd1ca3883edace1d65d33d08e3b801555b3b9','dea75e4827ff81b1ead1528dd2cd4baa:4d54820c933c67334cc00a88bff439f3','2026-02-01 12:13:56',_binary '',1),(1234511,'94041446580d31f3cf9cc6a63446c48f:eaa01501aba181ffe0cbb61738812f8a','bc1e36f208c3f7344c7d948295a9e71e:41bef94ef852ace8b25c96226a979ed0','0d3877460c18f4728633f8528ef9f076:5226d115b32ec5f909aae8cb62f9a70757b1f725b3977c66084d39e9bc89887b','2026-02-01 12:12:51',_binary '',1),(123456789,'pp','pp','pp@gmail.com','2026-01-27 08:45:40',_binary '',1);
/*!40000 ALTER TABLE `tclientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tdetalleventa`
--

DROP TABLE IF EXISTS `tdetalleventa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tdetalleventa`
--

LOCK TABLES `tdetalleventa` WRITE;
/*!40000 ALTER TABLE `tdetalleventa` DISABLE KEYS */;
INSERT INTO `tdetalleventa` VALUES (1,2,'P001',20,8.50,170.00,'2026-01-27 08:53:31',_binary '',1),(2,3,'P001',13,8.50,110.50,'2026-01-27 09:27:07',_binary '',1),(3,4,'P001',13,8.50,110.50,'2026-01-27 09:29:20',_binary '',1),(4,5,'P001',13,8.50,110.50,'2026-01-27 09:30:57',_binary '',1),(5,6,'P001',7,8.50,59.50,'2026-01-27 09:31:33',_binary '',1),(6,6,'P003',3,20.00,60.00,'2026-01-27 09:31:33',_binary '',1),(7,7,'P003',28,20.00,560.00,'2026-01-28 09:46:35',_binary '',1),(8,8,'PROD007',1,20.00,20.00,'2026-01-28 10:41:03',_binary '',1),(9,9,'PROD007',13,20.00,260.00,'2026-01-28 10:45:31',_binary '',1),(10,10,'PROD007',5,20.00,100.00,'2026-01-28 10:49:08',_binary '',1),(11,11,'PROD008',6,1.00,6.00,'2026-01-28 10:50:47',_binary '',1),(12,12,'PROD008',6,1.00,6.00,'2026-01-28 10:53:40',_binary '',1),(13,13,'P001',1,8.50,8.50,'2026-01-29 21:39:12',_binary '',1),(14,14,'P003',1,20.00,20.00,'2026-01-31 16:16:12',_binary '',1),(15,15,'P003',1,20.00,20.00,'2026-02-01 11:06:05',_binary '',1),(16,16,'P003',1,20.00,20.00,'2026-02-01 11:56:11',_binary '',1);
/*!40000 ALTER TABLE `tdetalleventa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `templeados`
--

DROP TABLE IF EXISTS `templeados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
INSERT INTO `templeados` VALUES (1,'Williams','Joel','Barbaito','Paco','2005-02-25',_binary '','willibarb2502@gmail.com','$2b$10$QBKj63wzEeBwT3JoRsf2OuEyemlVkTTlNYyv9OXl7WCFKh70Dekuq',71216858,'2026-01-25 11:26:02',_binary '',1,NULL),(2,'aa','aa','aa','aa','2000-12-12',_binary '','pac@gmail.com','$2b$10$WpPiHdDW5a4j8zr6tDD89ONw9CguWjKd3xQI.67hhLPI2/gIN6USa',1234567,'2026-01-25 11:30:43',_binary '',2,1),(3,'ll','ll','ll','ll','2222-12-12',_binary '','e@gmail.com','$2b$10$IRxjuU6OOrqXJVE7FgC78.IcqJrwmVXHfPd54fp/i2xXS9kksaOuS',87654,'2026-01-29 21:33:03',_binary '',2,1);
/*!40000 ALTER TABLE `templeados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tinventario`
--

DROP TABLE IF EXISTS `tinventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
INSERT INTO `tinventario` VALUES ('INV001','P001',79,'2026-06-30','2026-01-10',NULL,_binary '','2026-01-25 11:37:20',_binary '',1),('INV002','P002',50,'2027-01-15','2026-01-12',NULL,_binary '','2026-01-25 11:37:20',_binary '',1),('INV004','P004',80,'2026-05-10','2026-01-18',NULL,_binary '','2026-01-25 11:37:20',_binary '',1),('INV005','P005',60,'2026-03-25','2026-01-15',NULL,_binary '','2026-01-25 11:37:20',_binary '',1),('INV006','P006',100,'2027-08-01','2026-01-05',NULL,_binary '','2026-01-25 11:37:20',_binary '',1);
/*!40000 ALTER TABLE `tinventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tmetodopago`
--

DROP TABLE IF EXISTS `tmetodopago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
INSERT INTO `tmetodopago` VALUES (1,'Efectivo','Pago en efectivo','2026-01-25 11:26:02',_binary '',1),(2,'Tarjeta Débito','Pago con tarjeta de débito','2026-01-25 11:26:02',_binary '',1),(3,'QR','Pago mediante escaneo de código QR','2026-01-25 11:26:02',_binary '',1);
/*!40000 ALTER TABLE `tmetodopago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tproductos`
--

DROP TABLE IF EXISTS `tproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
INSERT INTO `tproductos` VALUES ('P001',1,'Coca Cola 500ml',8.50,'2026-01-25 11:37:20',_binary '',1),('P002',1,'Café Instantáneo',15.00,'2026-01-25 11:37:20',_binary '',1),('P003',2,'Hamburguesa Simple',20.00,'2026-01-25 11:37:20',_binary '',1),('P004',3,'Papas Fritas',6.00,'2026-01-25 11:37:20',_binary '',1),('P005',4,'Leche Entera 1L',7.20,'2026-01-25 11:37:20',_binary '',1),('P006',5,'Arroz 1Kg',9.50,'2026-01-25 11:37:20',_binary '',1),('PROD007',4,'semen',20.00,'2026-01-28 10:01:11',_binary '\0',1),('PROD008',4,'cum',1.00,'2026-01-28 10:50:02',_binary '\0',1);
/*!40000 ALTER TABLE `tproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `troles`
--

DROP TABLE IF EXISTS `troles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
INSERT INTO `troles` VALUES (1,'Administrador','Control total del sistema, permisos absolutos y cero culpa','2026-01-25 11:26:02',_binary '',1),(2,'Vendedor','Vende cosas, cobra mal y culpa al sistema','2026-01-25 11:26:02',_binary '',1);
/*!40000 ALTER TABLE `troles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tventas`
--

DROP TABLE IF EXISTS `tventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  PRIMARY KEY (`idventa`),
  KEY `fk_tventas_usuarioA` (`usuarioA`),
  KEY `fk_tventas_empleado` (`ciempleado`),
  KEY `fk_tventas_metodo` (`idmetodo`),
  CONSTRAINT `fk_tventas_empleado` FOREIGN KEY (`ciempleado`) REFERENCES `templeados` (`ciempleado`),
  CONSTRAINT `fk_tventas_metodo` FOREIGN KEY (`idmetodo`) REFERENCES `tmetodopago` (`idmetodo`),
  CONSTRAINT `fk_tventas_usuarioA` FOREIGN KEY (`usuarioA`) REFERENCES `templeados` (`ciempleado`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tventas`
--

LOCK TABLES `tventas` WRITE;
/*!40000 ALTER TABLE `tventas` DISABLE KEYS */;
INSERT INTO `tventas` VALUES (1,NULL,2,3,NULL,NULL,25.50,0.00,0.00,25.50,'2026-01-25 11:37:45',_binary '',2),(2,123456789,1,1,'2026-01-27','08:53:31',170.00,0.00,0.00,170.00,'2026-01-27 08:53:31',_binary '',1),(3,123456789,1,2,'2026-01-27','09:27:07',110.50,0.00,0.00,110.50,'2026-01-27 09:27:07',_binary '',1),(4,123456789,1,2,'2026-01-27','09:29:20',110.50,0.00,0.00,110.50,'2026-01-27 09:29:20',_binary '',1),(5,123456789,1,3,'2026-01-27','09:30:57',110.50,0.00,0.00,110.50,'2026-01-27 09:30:57',_binary '',1),(6,123456789,1,1,'2026-01-27','09:31:33',119.50,0.00,0.00,119.50,'2026-01-27 09:31:33',_binary '',1),(7,123456789,1,3,'2026-01-28','09:46:35',560.00,0.00,0.00,560.00,'2026-01-28 09:46:35',_binary '',1),(8,123456789,1,1,'2026-01-28','10:41:03',20.00,0.00,0.00,20.00,'2026-01-28 10:41:03',_binary '',1),(9,123456789,1,3,'2026-01-28','10:45:31',260.00,0.00,0.00,260.00,'2026-01-28 10:45:31',_binary '',1),(10,123456789,1,1,'2026-01-28','10:49:08',100.00,0.00,0.00,100.00,'2026-01-28 10:49:08',_binary '',1),(11,123456789,1,1,'2026-01-28','10:50:47',6.00,0.00,0.00,6.00,'2026-01-28 10:50:47',_binary '',1),(12,123456789,1,1,'2026-01-28','10:53:40',6.00,0.00,0.00,6.00,'2026-01-28 10:53:40',_binary '',1),(13,80,1,3,'2026-01-29','21:39:12',8.50,0.00,0.00,8.50,'2026-01-29 21:39:12',_binary '',1),(14,80,1,1,'2026-01-31','16:16:12',20.00,0.00,0.00,20.00,'2026-01-31 16:16:12',_binary '',1),(15,901,1,1,'2026-02-01','11:06:05',20.00,0.00,0.00,20.00,'2026-02-01 11:06:05',_binary '',1),(16,901,1,1,'2026-02-01','11:56:11',20.00,0.00,0.00,20.00,'2026-02-01 11:56:11',_binary '',1);
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

-- Dump completed on 2026-02-06  0:00:58
