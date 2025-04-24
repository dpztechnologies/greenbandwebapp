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
  `aid` int(50) NOT NULL,
  `firstname` varchar(500) NOT NULL,
  `lastname` varchar(500) NOT NULL,
  `email` varchar(500) NOT NULL,
  `phone_no` varchar(500) NOT NULL,
  `password` varchar(500) NOT NULL,
  `role` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`aid`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_no` (`phone_no`),
  UNIQUE KEY `aid` (`aid`),
  UNIQUE KEY `a_id` (`aid`),
  UNIQUE KEY `aid_2` (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (33,3677,'Peter','Mwambi','calebmwambi@gmail.com','0114958431','$2b$12$LXSlXFRO48zbTIwWIYnR9Om9jGOkCGB2RhBq5Lg8Xxpg6I6KccjDq','Super Admin'),(34,5977,'Caleb','Mwambi','c.mwambi@gmail.com','0700521998','$2b$12$QEzIuWdmrCjtb3rPsbWJYedPZ6Jht9qlqbHmB8Xt35Q2EH.FnaJNq','Super Admin'),(35,1617,'Jared','Mwangi','jmwangi@gmail.com','0714227121','$2b$12$xlMNTJ6MzBQuw2y.70p7UuNMar8.0844sbEgLonnCTDm9.T7KJUH6','System Admin'),(36,6061,'Caleb','Mwasagua','p.mwambi@gmail.com','0721623731','$2b$12$LZfGtv.rQNAO7RIFBu5SVur4yb6qpK4GAJ7o4XjLMhMP22uSyyapi','Super Admin');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins_activity`
--

DROP TABLE IF EXISTS `admins_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins_activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(50) NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'Offline',
  `can_access` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `a_id` (`aid`),
  UNIQUE KEY `aid` (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins_activity`
--

LOCK TABLES `admins_activity` WRITE;
/*!40000 ALTER TABLE `admins_activity` DISABLE KEYS */;
INSERT INTO `admins_activity` VALUES (3,3677,'Online',0),(4,5977,'Online',0),(5,1617,'Offline',0),(6,6061,'Offline',0);
/*!40000 ALTER TABLE `admins_activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(100) NOT NULL,
  `email` varchar(500) NOT NULL,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('18375efa09fe32ed511cefaeaca67badf4b5b6e666df52a238f3d9bc7da03072','c.mwambi@gmail.com','2025-04-24 19:50:50'),('8f2733dcf3d4c530a51caa60d37da82c93b6c0ca39ec9da4af54be48aac0ef92','calebmwambi@gmail.com','2025-04-24 21:05:37'),('daeea950d246984c32d1379f72c84972fb3c10807fe239425b10252ecd606d14','calebmwambi@gmail.com','2025-04-24 19:49:46'),('e2fffdb962102315772d81ff3723a43b4f88678f4c2c2e1616ac232fdcc5b91e','c.mwambi@gmail.com','2025-04-24 18:04:06');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-24 23:19:03
