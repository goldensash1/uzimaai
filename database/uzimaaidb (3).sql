-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 16, 2025 at 11:50 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uzimaaidb`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `adminId` int(11) NOT NULL,
  `adminPhone` varchar(20) DEFAULT NULL,
  `adminEmail` varchar(100) DEFAULT NULL,
  `adminUsername` varchar(100) DEFAULT NULL,
  `adminStatus` varchar(20) DEFAULT NULL,
  `adminPassword` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medecineReviews`
--

CREATE TABLE `medecineReviews` (
  `riviewId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `ReviewMessage` text NOT NULL,
  `rating` int(11) NOT NULL,
  `reviewStatus` int(11) NOT NULL,
  `reviewDate` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medecines`
--

CREATE TABLE `medecines` (
  `medicineId` int(11) NOT NULL,
  `medicineName` varchar(255) NOT NULL,
  `medicineUses` text NOT NULL,
  `medicineSideEffects` text NOT NULL,
  `medicineAlternatives` text NOT NULL,
  `medicineStatus` int(11) NOT NULL,
  `updatedDate` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `searchHistory`
--

CREATE TABLE `searchHistory` (
  `searchId` int(11) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  `searchContent` text DEFAULT NULL,
  `searchTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `serContext`
--

CREATE TABLE `userContext` (
  `contextId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `contextContent` text DEFAULT NULL,
  `contextTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userHistory`
--

CREATE TABLE `userHistory` (
  `historyId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `actionType` varchar(50) DEFAULT NULL,
  `actionContent` text DEFAULT NULL,
  `actionTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `emergencyphone` varchar(20) DEFAULT NULL,
  `userpassword` varchar(255) DEFAULT NULL,
  `userstatus` varchar(20) DEFAULT NULL,
  `useremail` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`adminId`);

--
-- Indexes for table `searchHistory`
--
ALTER TABLE `searchHistory`
  ADD PRIMARY KEY (`searchId`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `userContext`
--
ALTER TABLE `userContext`
  ADD PRIMARY KEY (`contextId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `userHistory`
--
ALTER TABLE `userHistory`
  ADD PRIMARY KEY (`historyId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `adminId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `searchHistory`
--
ALTER TABLE `searchHistory`
  MODIFY `searchId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userContext`
--
ALTER TABLE `userContext`
  MODIFY `contextId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userHistory`
--
ALTER TABLE `userHistory`
  MODIFY `historyId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `searchHistory`
--
ALTER TABLE `searchHistory`
  ADD CONSTRAINT `searchhistory_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`);

--
-- Constraints for table `userContext`
--
ALTER TABLE `userContext`
  ADD CONSTRAINT `usercontext_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userid`);

--
-- Constraints for table `userHistory`
--
ALTER TABLE `userHistory`
  ADD CONSTRAINT `userhistory_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
