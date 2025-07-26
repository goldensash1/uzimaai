-- =====================================================
-- UzimaAI Admin Dashboard Database Setup
-- =====================================================
-- This file contains the complete database setup for the UzimaAI Admin Dashboard
-- Run this file to create the database with all tables and sample data
-- =====================================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `uzimaaidb` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_general_ci;

-- Use the database
USE `uzimaaidb`;

-- =====================================================
-- Table: admin
-- =====================================================
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `adminId` int NOT NULL AUTO_INCREMENT,
  `adminPhone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adminEmail` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adminUsername` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adminStatus` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adminPassword` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`adminId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- Table: users
-- =====================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `emergencyphone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userpassword` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userstatus` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `useremail` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- Table: medecines
-- =====================================================
DROP TABLE IF EXISTS `medecines`;
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

-- =====================================================
-- Table: medecineReviews
-- =====================================================
DROP TABLE IF EXISTS `medecineReviews`;
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

-- =====================================================
-- Table: searchHistory
-- =====================================================
DROP TABLE IF EXISTS `searchHistory`;
CREATE TABLE `searchHistory` (
  `searchId` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `searchContent` text COLLATE utf8mb4_general_ci,
  `searchTime` datetime DEFAULT NULL,
  PRIMARY KEY (`searchId`),
  KEY `userid` (`userid`),
  CONSTRAINT `searchhistory_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- Table: userContext
-- =====================================================
DROP TABLE IF EXISTS `userContext`;
CREATE TABLE `userContext` (
  `contextId` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `contextContent` text COLLATE utf8mb4_general_ci,
  `contextTime` datetime DEFAULT NULL,
  PRIMARY KEY (`contextId`),
  KEY `userId` (`userId`),
  CONSTRAINT `usercontext_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- Table: userHistory
-- =====================================================
DROP TABLE IF EXISTS `userHistory`;
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

-- =====================================================
-- Insert Sample Data
-- =====================================================

-- Admin users (password: admin123 for all)
INSERT INTO `admin` VALUES 
(1, '+1234567890', 'admin@uzimaai.com', 'admin', 'active', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy');

-- Sample users (password: user123 for all)
INSERT INTO `users` VALUES 
(1, '+1234567890', '+1234567891', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Hy', 'active', 'john@example.com', 'John Doe'),
(2, '+1234567892', '+1234567893', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Hy', 'active', 'jane@example.com', 'Jane Smith'),
(13, '+1234567891', '+1234567892', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active', 'alice@example.com', 'Alice Johnson'),
(14, '+1234567893', '+1234567894', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active', 'bob@example.com', 'Bob Smith'),
(15, '+1234567895', '+1234567896', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active', 'carol@example.com', 'Carol Davis'),
(16, '+1234567897', '+1234567898', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active', 'david@example.com', 'David Wilson'),
(17, '+1234567899', '+1234567900', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active', 'emma@example.com', 'Emma Brown'),
(18, '+1234567901', '+1234567902', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active', 'frank@example.com', 'Frank Miller'),
(19, '+1234567903', '+1234567904', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active', 'grace@example.com', 'Grace Taylor'),
(20, '+1234567905', '+1234567906', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active', 'henry@example.com', 'Henry Anderson'),
(21, '+1234567907', '+1234567908', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active', 'ivy@example.com', 'Ivy Martinez'),
(22, '+1234567909', '+1234567910', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active', 'jack@example.com', 'Jack Thompson');

-- Sample medicines
INSERT INTO `medecines` VALUES 
(1, 'Aspirin', 'Pain relief, fever reduction, blood thinning', 'Stomach irritation, bleeding risk, allergic reactions', 'Ibuprofen, Acetaminophen, Naproxen', 1, '2025-07-25 11:45:40'),
(2, 'Lisinopril', 'High blood pressure, heart failure treatment', 'Dry cough, dizziness, low blood pressure', 'Enalapril, Ramipril, Captopril', 1, '2025-07-25 11:45:40'),
(3, 'Metformin', 'Type 2 diabetes management', 'Nausea, diarrhea, lactic acidosis risk', 'Sulfonylureas, DPP-4 inhibitors, SGLT2 inhibitors', 1, '2025-07-25 11:45:40'),
(4, 'Atorvastatin', 'High cholesterol treatment', 'Muscle pain, liver problems, digestive issues', 'Simvastatin, Rosuvastatin, Pravastatin', 1, '2025-07-25 11:45:40'),
(5, 'Omeprazole', 'Acid reflux, stomach ulcer treatment', 'Headache, diarrhea, vitamin B12 deficiency', 'Lansoprazole, Pantoprazole, Esomeprazole', 1, '2025-07-25 11:45:40'),
(6, 'Amlodipine', 'High blood pressure, chest pain treatment', 'Swelling, dizziness, flushing', 'Nifedipine, Diltiazem, Verapamil', 1, '2025-07-25 11:45:40'),
(7, 'Losartan', 'High blood pressure, kidney protection', 'Dizziness, fatigue, high potassium', 'Valsartan, Irbesartan, Candesartan', 1, '2025-07-25 11:45:40'),
(8, 'Sertraline', 'Depression, anxiety treatment', 'Nausea, insomnia, sexual dysfunction', 'Fluoxetine, Escitalopram, Paroxetine', 1, '2025-07-25 11:45:40'),
(9, 'Albuterol', 'Asthma, breathing problems relief', 'Tremors, increased heart rate, nervousness', 'Salmeterol, Formoterol, Levalbuterol', 1, '2025-07-25 11:45:40'),
(10, 'Warfarin', 'Blood clot prevention', 'Bleeding risk, bruising, drug interactions', 'Dabigatran, Rivaroxaban, Apixaban', 1, '2025-07-25 11:45:40');

-- Sample medicine reviews
INSERT INTO `medecineReviews` VALUES 
(1, 3, 'Great pain relief, works quickly for headaches', 5, 1, '2025-07-25 11:45:58', 1),
(2, 4, 'Effective but causes stomach upset', 3, 1, '2025-07-25 11:45:58', 1),
(3, 5, 'Helped lower my blood pressure significantly', 5, 1, '2025-07-25 11:45:58', 2),
(4, 6, 'Good medication but causes dry cough', 4, 0, '2025-07-25 11:45:58', 2),
(5, 7, 'Excellent for diabetes management', 5, 1, '2025-07-25 11:45:58', 3),
(6, 8, 'Works well but causes some digestive issues', 4, 1, '2025-07-25 11:45:58', 3),
(7, 9, 'Lowered my cholesterol effectively', 5, 1, '2025-07-25 11:45:58', 4),
(8, 10, 'Good results but some muscle pain', 3, 1, '2025-07-25 11:45:58', 4),
(9, 11, 'Relieved my acid reflux completely', 5, 1, '2025-07-25 11:45:58', 5),
(10, 12, 'Effective but expensive', 4, 1, '2025-07-25 11:45:58', 5);

-- Sample search history
INSERT INTO `searchHistory` VALUES 
(11, 13, 'headache medicine', '2025-07-25 11:46:24'),
(12, 14, 'blood pressure medication', '2025-07-25 11:46:24'),
(13, 15, 'diabetes treatment', '2025-07-25 11:46:24'),
(14, 16, 'cholesterol lowering drugs', '2025-07-25 11:46:24'),
(15, 17, 'acid reflux relief', '2025-07-25 11:46:24'),
(16, 18, 'asthma inhaler', '2025-07-25 11:46:24'),
(17, 19, 'depression medication', '2025-07-25 11:46:24'),
(18, 20, 'pain relief options', '2025-07-25 11:46:24'),
(19, 21, 'blood thinner alternatives', '2025-07-25 11:46:24'),
(20, 22, 'side effects of metformin', '2025-07-25 11:46:24');

-- Sample user context
INSERT INTO `userContext` VALUES 
(1, 13, 'User has frequent headaches and looking for pain relief', '2025-07-25 11:46:41'),
(2, 14, 'User has high blood pressure and seeking medication', '2025-07-25 11:46:41'),
(3, 15, 'User has type 2 diabetes and managing treatment', '2025-07-25 11:46:41'),
(4, 16, 'User has high cholesterol and exploring options', '2025-07-25 11:46:41'),
(5, 17, 'User has acid reflux and seeking relief', '2025-07-25 11:46:41'),
(6, 18, 'User has asthma and managing symptoms', '2025-07-25 11:46:41'),
(7, 19, 'User has depression and seeking treatment', '2025-07-25 11:46:41'),
(8, 20, 'User has chronic pain and exploring options', '2025-07-25 11:46:41'),
(9, 21, 'User has blood clot risk and seeking prevention', '2025-07-25 11:46:41'),
(10, 22, 'User has diabetes and managing side effects', '2025-07-25 11:46:41');

-- Sample user history
INSERT INTO `userHistory` VALUES 
(1, 13, 'login', 'User logged in successfully', '2025-07-25 11:46:34'),
(2, 13, 'search', 'Searched for headache medicine', '2025-07-25 11:46:34'),
(3, 14, 'login', 'User logged in successfully', '2025-07-25 11:46:34'),
(4, 14, 'review', 'Posted review for aspirin', '2025-07-25 11:46:34'),
(5, 15, 'login', 'User logged in successfully', '2025-07-25 11:46:34'),
(6, 15, 'search', 'Searched for blood pressure medication', '2025-07-25 11:46:34'),
(7, 16, 'login', 'User logged in successfully', '2025-07-25 11:46:34'),
(8, 16, 'review', 'Posted review for lisinopril', '2025-07-25 11:46:34'),
(9, 17, 'login', 'User logged in successfully', '2025-07-25 11:46:34'),
(10, 17, 'search', 'Searched for diabetes treatment', '2025-07-25 11:46:34');

-- =====================================================
-- Database Setup Complete
-- =====================================================
-- 
-- Default Admin Credentials:
-- Username: admin
-- Email: admin@uzimaai.com
-- Password: admin123
--
-- Sample User Credentials (for testing):
-- Username: john@example.com
-- Password: user123
--
-- Database contains:
-- - 1 admin user
-- - 12 sample users
-- - 10 medicines with detailed information
-- - 10 medicine reviews
-- - 10 search history records
-- - 10 user context records
-- - 10 user history records
-- ===================================================== 