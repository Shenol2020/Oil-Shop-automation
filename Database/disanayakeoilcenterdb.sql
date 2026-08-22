-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: disanayakaoilcenterdb
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `pID` int(11) NOT NULL,
  `p_name` varchar(255) DEFAULT NULL,
  `volume` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `pic` varchar(255) DEFAULT '/Mobil-Full-Synthetic-Motor-Oil-5W.avif',
  `p_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Mobil Motor Oil','1L','Engine oil','Mobil','Sreemath oilMart','10500','/Mobil-Full-Synthetic-Motor-Oil-5W.avif','ABC'),(2,'Mobil Super™ Friction Fighter 15W-40 -4L','4L','Engine oil','Mobil','Okumara oilMart','15900','/Mobil-Full-Synthetic-Motor-Oil-5W.avif','ABC'),(3,'Mobilube HD 80W-90 Mineral Gear Oil – 4L','4L','Gear oil','Mobil','Okumara oilMart','20930','/Mobil-Full-Synthetic-Motor-Oil-5W.avif','ABC'),(4,'Mobilfluid 424 80W-90 Multipurpose Tractor Lubricant – 1L','1L','Gear oil','Mobil','Sreemath oilMart','4190','/Mobil-Full-Synthetic-Motor-Oil-5W.avif','ABC'),(5,'Mobil ATF 3309 Mineral Transmission Oil – 1L','1L','Gear oil','Mobil','Okumara oilMart','7490','/Mobil-Full-Synthetic-Motor-Oil-5W.avif','ABC'),(6,'Kabal Motor Oil','2L','chain oil','Kabal','Sreemath oilMart','2000','/Mobil-Full-Synthetic-Motor-Oil-5W.avif','ABC');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-23  0:23:33
