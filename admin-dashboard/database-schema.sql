-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: uzimaaidb
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `adminId` int NOT NULL AUTO_INCREMENT,
  `adminPhone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adminEmail` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adminUsername` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adminStatus` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adminPassword` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`adminId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `medecineReviews`
--

DROP TABLE IF EXISTS `medecineReviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medecineReviews` (
  `riviewId` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `ReviewMessage` text COLLATE utf8mb4_general_ci NOT NULL,
  `rating` int NOT NULL,
  `reviewStatus` int NOT NULL,
  `reviewDate` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `medicineId` int DEFAULT NULL,
  PRIMARY KEY (`riviewId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `medecines`
--

DROP TABLE IF EXISTS `medecines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medecines` (
  `medicineId` int NOT NULL AUTO_INCREMENT,
  `medicineName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `medicineUses` text COLLATE utf8mb4_general_ci NOT NULL,
  `medicineSideEffects` text COLLATE utf8mb4_general_ci NOT NULL,
  `medicineAlternatives` text COLLATE utf8mb4_general_ci NOT NULL,
  `medicineStatus` int NOT NULL,
  `updatedDate` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`medicineId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `searchHistory`
--

DROP TABLE IF EXISTS `searchHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `searchHistory` (
  `searchId` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `searchContent` text COLLATE utf8mb4_general_ci,
  `searchTime` datetime DEFAULT NULL,
  PRIMARY KEY (`searchId`),
  KEY `userid` (`userid`),
  CONSTRAINT `searchhistory_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userContext`
--

DROP TABLE IF EXISTS `userContext`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userContext` (
  `contextId` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `contextContent` text COLLATE utf8mb4_general_ci,
  `contextTime` datetime DEFAULT NULL,
  PRIMARY KEY (`contextId`),
  KEY `userId` (`userId`),
  CONSTRAINT `usercontext_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userHistory`
--

DROP TABLE IF EXISTS `userHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userHistory` (
  `historyId` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `actionType` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `actionContent` text COLLATE utf8mb4_general_ci,
  `actionTime` datetime DEFAULT NULL,
  PRIMARY KEY (`historyId`),
  KEY `userId` (`userId`),
  CONSTRAINT `userhistory_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `emergencyphone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userpassword` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userstatus` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `useremail` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'uzimaaidb'
--

--
-- Dumping routines for database 'uzimaaidb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-26 11:43:14
