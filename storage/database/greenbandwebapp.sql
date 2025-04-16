-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: greenbandwebapp
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

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
-- Current Database: `greenbandwebapp`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `greenbandwebapp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `greenbandwebapp`;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(50) NOT NULL,
  `firstname` varchar(500) NOT NULL,
  `lastname` varchar(500) NOT NULL,
  `email` varchar(500) NOT NULL,
  `phone_no` varchar(500) NOT NULL,
  `password` varchar(500) NOT NULL,
  `role` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_no` (`phone_no`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (17,10205,'Peter','Mwambi','calebmwambi@gmail.com','0700521998','$2b$12$NJRmBTJjyiiqz5RuNlFKoOs7DV9AFchI9dnrs.ZeYOO8PJemYsR1G','Super Admin'),(18,5837,'Susan','Njeri','sue@gmail.com','0114958431','$2b$12$3XYF44nY3WGoQtp.zzhGCelrKBydvgY5xt.DbnVGxw/vNrx1dH1uK','System Admin'),(19,7974,'Joyce','Wangari','joyce@gmail.com','0723117035','$2b$12$jjQe3aCz0ivWU9Uc7jOcUel52VCmzw/t1iwQAU4OyqH5md.EL4Kuq','System Admin'),(20,6678,'Anthony','Njenga','anthony.njenga@gmail.com','07117231221','$2b$12$hlez3y6Ze9vx7CQBW73SJeLdppwQVHQ8d4ANBIlEbb1.1cLnVlCHW','Super Admin'),(21,2456,'Anthony','Kamau','anthony.kamau@gmail.com','0113277585','$2b$12$vJwP7GQ1U6ytTbjr6eve1egi19mBq3CS3wXluVDzIlBcIoyd4a6GG','System Admin'),(22,7466,'Nancy','Mueni','mueni.nancy@gmail.com','0721227121','$2b$12$YRc.MLw5c6FvECUb7okoCOsDMNExjGq6NUO7vhmuqjoD/ckAWMIj.','System Admin'),(23,4816,'Nicholas','Amani','nicholas.amani@gmail.com','0711221377','$2b$12$naMq6n7CqH341udOxzI58e0QOsR2xODUG3xOQe0njGmd72pggInde','System Admin');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-16 18:10:30
