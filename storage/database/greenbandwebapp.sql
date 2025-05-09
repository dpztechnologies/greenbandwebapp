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
  `id` int(11) NOT NULL,
  `seq` int(11) NOT NULL,
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
  UNIQUE KEY `aid_2` (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,25,1137,'Crispian','Omutala','crispian.305@gmail.com','0115177621','$2b$12$BSVV3Mn7Nyl70ucf74tP6eMuQzGtp51csxBRdxfyWvAu9VhsH.o6K','System Admin','2025-05-02 14:10:26','2025-05-02 14:10:26'),(2,24,1617,'Jared','Mwangi','jmwangi@gmail.com','0714227121','$2b$12$xlMNTJ6MzBQuw2y.70p7UuNMar8.0844sbEgLonnCTDm9.T7KJUH6','System Admin','2025-04-25 00:01:40','2025-04-25 00:02:15'),(3,23,1797,'Beth','Njoki','beth.njoki@gmail.com','0741337165','$2b$12$K7NrXhPiQ..PmVFp1cxC8exkkndOyvHER24Ybxe.8WnksLRsO4myu','Super Admin','2025-05-02 17:31:37','2025-05-02 17:31:37'),(4,22,1831,'Sharon','Njeri','sharyn.njeri@gmail.com','0723177351','$2b$12$L6BmUwY.O7eQAaLr0lzSTO5X8xrnxpr3KIKNVTSE3bF/IHqctzgIu','Super Admin','2025-04-29 23:55:04','2025-04-29 23:55:04'),(5,21,1991,'Elizabeth','Mwaniki','elizabeth365@gmail.com','0792177348','$2b$12$PUzpKmvVpYvWfRms.g9DveGmhQ48yGG/woe/Ztp0rnSw4U0kLCwJu','Super Admin','2025-05-02 14:00:09','2025-05-02 14:00:09'),(6,20,2058,'Jane','Mwende','mwende.jane@gmail.com','0721772137','$2b$12$EJ1/LMGoxgSShSGr4oweieS0jHah1ez1HgnhxXf2oEfkLXCdr4NW2','System Admin','2025-04-25 01:35:07','2025-04-25 01:35:07'),(7,19,2283,'Angela','Wangari','angy.wangari@gmail.com','0721377151','$2b$12$UXX6wauucM6t66TLZrSSgOPZwg5fZZ.7AcJcWNkB6dgXGwDnVwwZy','System Admin','2025-04-25 00:01:40','2025-04-25 00:02:15'),(8,18,2515,'Daniel','Ngamau','ngamau.danny@gmail.com','0731557198','$2b$12$zSImFaktGWOGAhaOfI0veOS.JWFM2h9SsGZyHQinvywxA/7ly976y','Super Admin','2025-05-02 14:17:02','2025-05-02 14:17:02'),(9,17,2621,'Nicholas','Ndegwa','nicholas.ndegwa@gmail.com','0721977431','$2b$12$BIeMW16tBYuW5XqBzlwYYOOgi6CNxcVI3DgiHhHajCP5IrK2Kl4Ku','Super Admin','2025-04-29 23:44:13','2025-04-29 23:44:13'),(10,16,3205,'Mirriam','Ndila','mirriam.ndila@gmail.com','0727352111','$2b$12$/XB2BYS1Z.sNngYWbos42uub1l5ctt2mwI.AACuBK0uZxDrtxbERi','System Admin','2025-04-25 02:27:15','2025-04-25 02:27:15'),(11,15,3404,'Jotham','Ndungu','jotham.ndungu@gmail.com','0754177231','$2b$12$hB2xPtQxKfXbSx9NpnjYb.2ZSpmqAgis7RVwhG/kFexxuximvnuoG','Super Admin','2025-05-02 13:57:08','2025-05-02 13:57:08'),(12,14,3599,'Joan','Mwende','joan.mwende@gmail.com','0712377121','$2b$12$pXJzsSJ7d/AhQUmNxOx15uikHfrK93uQM7T3vr9C0L/r4w//zRQkC','System Admin','2025-04-25 00:21:01','2025-04-25 00:21:01'),(13,13,3677,'Peter','Mwambi','calebmwambi@gmail.com','0114958431','$2b$12$LXSlXFRO48zbTIwWIYnR9Om9jGOkCGB2RhBq5Lg8Xxpg6I6KccjDq','Super Admin','2025-04-25 00:01:40','2025-04-25 00:02:15'),(14,12,4783,'Brenda','Mwamburi','mwamuri.brenda@gmail.com','0793177231','$2b$12$lP2yJ3aRYVVeWa6fpWisH.Y.yrX7IJfUUOAPgDlsFKOmTXe38QpoO','System Admin','2025-05-02 14:23:31','2025-05-02 14:23:31'),(15,11,5516,'Rosemary','Njoki','rosemary.njoki@gmail.com','0735177231','$2b$12$R43xNGGD2KKW2uC7P58GhOfkzBuvnNC2AxbY3PJMzVpsXgyocu1X2','Super Admin','2025-05-02 14:03:25','2025-05-02 14:03:25'),(16,10,5576,'Joseph','Oluoch','oluoch.joseph@gmail.com','0731227138','$2b$12$jnZQ8F2cTUnVYUS6VCVrCuo9cVqj53MuqO1pBVDEXxbk3kGRxrf4W','Super Admin','2025-05-02 14:05:14','2025-05-02 14:05:14'),(17,9,5761,'Benard','Mwatela','mwatela254@gmail.com','0112511732','$2b$12$N5iW5oSUZJ7SL1IUDwxkJOKiXgpkLCrnRUoE1.ISDC0npxj3ZESvC','System Admin','2025-05-02 17:33:24','2025-05-02 17:33:24'),(18,8,5977,'Caleb','Mwambi','c.mwambi@gmail.com','0700521998','$2b$12$QEzIuWdmrCjtb3rPsbWJYedPZ6Jht9qlqbHmB8Xt35Q2EH.FnaJNq','Super Admin','2025-04-25 00:01:40','2025-04-25 00:02:15'),(19,7,6061,'Caleb','Mwasagua','p.mwambi@gmail.com','0721623731','$2b$12$LZfGtv.rQNAO7RIFBu5SVur4yb6qpK4GAJ7o4XjLMhMP22uSyyapi','Super Admin','2025-04-25 00:01:40','2025-04-25 00:02:15'),(20,6,6244,'Caroline','Mwende','carolyne.mwende@gmail.com','0724177321','$2b$12$GSRXPnzszOUmwEDHM8BVyOft9AsJKJnv39yjQHeZ0h5z3Hti6XYii','System Admin','2025-05-02 13:58:37','2025-05-02 13:58:37'),(21,5,6582,'Antonnette','Wairimu','wairimu.antonnette@gmail.com','0731778121','$2b$12$Dohue/KiFcu8dHb0bAP0meDHlNydgFi.NfuXi68IZExpomBOSl69.','Super Admin','2025-05-02 14:14:12','2025-05-02 14:14:12'),(22,4,7336,'Jonathan','Mwangi','jj.mwangi@gmail.com','0712276188','$2b$12$7T8GqvzW1z0SAw2cpUPPn.4kYcDMi1AV2JL40Alu99Ua.u4lWIUmm','System Admin','2025-04-25 00:01:40','2025-04-25 00:02:15'),(23,3,9146,'Karen','Njoki','karen.njoki@gmail.com','0721337121','$2b$12$9AfsBubF0X6XieaNs8QiP.tywbF257xhDje4RaeVzAFkgZTJt1LJS','System Admin','2025-04-25 00:01:40','2025-04-25 00:02:15'),(24,2,9196,'Jeff','Njenga','njenga.jeff@gmail.com','0786122390','$2b$12$5p3v04Pm.YCSBmSfn1E7i.HA5Ld/RMXv6kj2rLoJKqzDuWUaYodwW','System Admin','2025-05-02 14:08:37','2025-05-02 14:08:37'),(25,1,10693,'Lilian','Ndila','lilian.ndila@gmail.com','0751337129','$2b$12$ZPy09h6sttsgpvXyXsXOGuaY8keiMokH3p7o0hwJv/xcO2cMAEET2','System Admin','2025-05-02 14:18:39','2025-05-02 14:18:39');
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
  `can_access` int(100) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `a_id` (`aid`),
  UNIQUE KEY `aid` (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins_activity`
--

LOCK TABLES `admins_activity` WRITE;
/*!40000 ALTER TABLE `admins_activity` DISABLE KEYS */;
INSERT INTO `admins_activity` VALUES (3,3677,'Online',0),(4,5977,'Offline',0),(5,1617,'Offline',0),(6,6061,'Offline',0),(7,7336,'Offline',0),(8,2283,'Offline',0),(9,9146,'Offline',0),(10,3599,'Offline',0),(11,2058,'Offline',0),(12,3205,'Offline',0),(13,1831,'Online',0),(14,3404,'Offline',0),(15,6244,'Offline',0),(16,1991,'Offline',0),(17,5516,'Offline',0),(18,5576,'Offline',0),(19,9196,'Offline',0),(20,1137,'Offline',0),(21,6582,'Offline',0),(22,2515,'Offline',0),(23,10693,'Offline',0),(24,4783,'Offline',0),(25,1797,'Offline',0),(26,5761,'Offline',0);
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
INSERT INTO `sessions` VALUES ('4acecba57dfdbd025beb9ec58f274c6aaf2756a6ae276e53cb2231de9fd4536b','calebmwambi@gmail.com','2025-05-06 16:36:45','33d2ff25260841cbd7c3ae5f0380e9bc772cf23c1f3cce98722888d8cd1dd23b');
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

-- Dump completed on 2025-05-06 16:44:59
