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
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `aid` int(50) NOT NULL,
  `firstname` varchar(500) NOT NULL,
  `lastname` varchar(500) NOT NULL,
  `email` varchar(500) NOT NULL,
  `phone_no` varchar(500) NOT NULL,
  `password` varchar(500) NOT NULL,
  `role` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`aid`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_no` (`phone_no`),
  UNIQUE KEY `aid` (`aid`),
  UNIQUE KEY `a_id` (`aid`),
  UNIQUE KEY `aid_2` (`aid`),
  FULLTEXT KEY `ft_index` (`firstname`,`lastname`,`email`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (13,3677,'Peter','Mwambi','calebmwambi@gmail.com','0114958431','$2b$12$LXSlXFRO48zbTIwWIYnR9Om9jGOkCGB2RhBq5Lg8Xxpg6I6KccjDq','Super Admin','2025-04-25 00:01:40','2025-04-25 00:02:15'),(31,2146,'Beatrice','Njoki','beatrice.njoki@gmail.com','0715311775','$2b$12$Rtu0vYTIMJzSkioMzoJmiu87xUHez9fReDXw78/lxqz5g6p20qQM6','Super Admin','2025-05-23 18:43:29','2025-05-23 18:43:29'),(36,7580,'Millicent','Njeri','millie.njeri@gmail.com','0723177315','$2b$12$T0Y2530lV8EmQziq349BGefrQaW7dd4kjSEDDhTL2j576I/B/fP2q','Super Admin','2025-05-28 19:46:55','2025-05-28 19:46:55'),(47,8414,'Morgan','Ochieng','morgan.ochieng@gmail.com','0723177231','$2b$12$Eh3brkOTj52GkwiACnfUuOsGd2X8t5mUkG6iD5TB3Pa1NoosQJWbG','System Admin','2025-05-28 21:08:10','2025-05-28 21:08:10'),(51,8061,'Job','Ndungu','job.ndungu@gmail.com','0711337121','$2b$12$1EZkW83imdIJYdKSPIPAc./8x3xV1C.UXvQOsDyPFEmPnZC7eAK7u','System Admin','2025-06-09 16:48:12','2025-06-09 16:48:12'),(52,9332,'Gladys','Njoki','gladysnjoki@gmail.com','0714337181','$2b$12$Tc9KhVlskTkh0EBAKSAFW.cimQZK1cXwu0sapcIis5gPM62AgFKO.','Super Admin','2025-06-09 17:02:18','2025-06-09 17:02:18'),(53,7920,'Jane','Koki','koki.jane@gmail.com','0711237105','$2b$12$nIgknrKd9B28VO9OO/ME4uNNTnvmFTa/BdQD/PfmUGAuvMB/fVKRq','System Admin','2025-06-10 05:15:30','2025-06-10 05:15:30');
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
  `can_access` tinyint(1) NOT NULL DEFAULT 0,
  `last_seen` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `activity` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`activity`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `a_id` (`aid`),
  UNIQUE KEY `aid` (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins_activity`
--

LOCK TABLES `admins_activity` WRITE;
/*!40000 ALTER TABLE `admins_activity` DISABLE KEYS */;
INSERT INTO `admins_activity` VALUES (3,3677,'Offline',1,'2025-06-13 10:24:35','[{\"date\":\"12/06/2025\",\"time\":\"6:55PM\",\"type\":\"logout\",\"desc\":\"Logged out at 6:55pm\"},{\"date\":\"12/06/2025\",\"time\":\"6:56PM\",\"type\":\"login\",\"desc\":\"Logged in at 6:56pm\"},{\"date\":\"12/06/2025\",\"time\":\"6:56PM\",\"type\":\"logout\",\"desc\":\"Logged out at 6:56pm\"},{\"date\":\"12/06/2025\",\"time\":\"7:19PM\",\"type\":\"login\",\"desc\":\"Logged in at 7:19pm\"},{\"date\":\"12/06/2025\",\"time\":\"7:37PM\",\"type\":\"Admin account update\",\"desc\":\"Updated admin <a class=\\\"text-decoration-none\\\" href=\\\"/super-admin/admins/show?aid=8061\\\">Job</a>\"},{\"date\":\"12/06/2025\",\"time\":\"7:37PM\",\"type\":\"logout\",\"desc\":\"Logged out at 7:37pm\"},{\"date\":\"12/06/2025\",\"time\":\"7:41PM\",\"type\":\"login\",\"desc\":\"Logged in at 7:41pm\"},{\"date\":\"12/06/2025\",\"time\":\"7:42PM\",\"type\":\"Admin account update\",\"desc\":\"Updated admin <a class=\\\"text-decoration-none\\\" href=\\\"/super-admin/admins/show?aid=7920\\\">Jane</a>\"},{\"date\":\"12/06/2025\",\"time\":\"7:42PM\",\"type\":\"logout\",\"desc\":\"Logged out at 7:42pm\"},{\"date\":\"12/06/2025\",\"time\":\"8:11PM\",\"type\":\"login\",\"desc\":\"Logged in at 8:11pm\"},{\"date\":\"12/06/2025\",\"time\":\"8:58PM\",\"type\":\"logout\",\"desc\":\"Logged out at 8:58pm\"},{\"date\":\"12/06/2025\",\"time\":\"9:00PM\",\"type\":\"login\",\"desc\":\"Logged in at 9:00pm\"},{\"date\":\"13/06/2025\",\"time\":\"1:24PM\",\"type\":\"login\",\"desc\":\"Logged in at 1:24pm\"},{\"date\":\"13/06/2025\",\"time\":\"1:24PM\",\"type\":\"logout\",\"desc\":\"Logged out at 1:24pm\"}]'),(32,2146,'Offline',0,'2025-06-12 07:55:13','{}'),(37,7580,'Offline',0,'2025-06-12 07:55:13','{}'),(38,8414,'Offline',1,'2025-06-12 14:46:21','{}'),(41,8061,'Offline',0,'2025-06-12 07:55:13','{}'),(42,9332,'Offline',1,'2025-06-13 10:27:26','[{\"date\":\"12/06/2025\",\"time\":\"6:55PM\",\"type\":\"login\",\"desc\":\"Logged in at 6:55pm\"},{\"date\":\"12/06/2025\",\"time\":\"6:56PM\",\"type\":\"logout\",\"desc\":\"Logged out at 6:56pm\"},{\"date\":\"12/06/2025\",\"time\":\"6:57PM\",\"type\":\"login\",\"desc\":\"Logged in at 6:57pm\"},{\"date\":\"12/06/2025\",\"time\":\"7:19PM\",\"type\":\"Admin account update\",\"desc\":\"Updated admin <a href=\\\"/super-admin/admins/show?aid=7920\\\">Jane</a>\"},{\"date\":\"12/06/2025\",\"time\":\"7:19PM\",\"type\":\"logout\",\"desc\":\"Logged out at 7:19pm\"},{\"date\":\"12/06/2025\",\"time\":\"7:37PM\",\"type\":\"login\",\"desc\":\"Logged in at 7:37pm\"},{\"date\":\"12/06/2025\",\"time\":\"7:39PM\",\"type\":\"Admin account update\",\"desc\":\"Updated admin <a class=\\\"text-decoration-none\\\" href=\\\"/super-admin/admins/show?aid=7920\\\">Jane</a>\"},{\"date\":\"12/06/2025\",\"time\":\"7:39PM\",\"type\":\"logout\",\"desc\":\"Logged out at 7:39pm\"},{\"date\":\"12/06/2025\",\"time\":\"7:42PM\",\"type\":\"login\",\"desc\":\"Logged in at 7:42pm\"},{\"date\":\"12/06/2025\",\"time\":\"8:10PM\",\"type\":\"logout\",\"desc\":\"Logged out at 8:10pm\"},{\"date\":\"13/06/2025\",\"time\":\"1:24PM\",\"type\":\"login\",\"desc\":\"Logged in at 1:24pm\"},{\"date\":\"13/06/2025\",\"time\":\"1:27PM\",\"type\":\"logout\",\"desc\":\"Logged out at 1:27pm\"}]'),(43,7920,'Offline',1,'2025-06-12 13:25:22','{}');
/*!40000 ALTER TABLE `admins_activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequences`
--

DROP TABLE IF EXISTS `sequences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sequences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_name` varchar(500) NOT NULL,
  `next_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `table_name` (`table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequences`
--

LOCK TABLES `sequences` WRITE;
/*!40000 ALTER TABLE `sequences` DISABLE KEYS */;
/*!40000 ALTER TABLE `sequences` ENABLE KEYS */;
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
  `device_token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
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

-- Dump completed on 2025-06-13 13:35:19
