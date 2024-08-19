-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 19, 2024 at 05:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat`
--

-- --------------------------------------------------------

--
-- Table structure for table `goods`
--

CREATE TABLE `goods` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `imagePath` varchar(255) NOT NULL,
  `sellerID` int(11) NOT NULL,
  `dateAdded` datetime NOT NULL DEFAULT current_timestamp(),
  `likes` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `goods`
--

INSERT INTO `goods` (`id`, `name`, `description`, `imagePath`, `sellerID`, `dateAdded`, `likes`) VALUES
(9, 'Testing Good', 'made and made ', 'uploads\\60fa5aeb2d3ea70ceb8817cf9e0fd24e', 6, '2024-08-02 21:10:02', 2),
(10, 'Hacking tool (Malware)', 'use it wisely', 'uploads\\98859f6f4dc8e530337917cc6b77167e', 7, '2024-08-04 06:22:59', 2),
(11, 'addd', 'sdjflkjhdflaj', 'uploads\\ee2e1eda3162ce9f9a2b6911f898eae1', 7, '2024-08-04 20:13:10', 2);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `groupID` int(11) NOT NULL,
  `groupName` varchar(100) NOT NULL,
  `groupPasscode` varchar(100) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `memberLimit` int(11) DEFAULT 50,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`groupID`, `groupName`, `groupPasscode`, `createdBy`, `memberLimit`, `createdAt`) VALUES
(1, 'group1nene', 'g1', 6, 10, '2024-08-16 19:42:29');

-- --------------------------------------------------------

--
-- Table structure for table `group_members`
--

CREATE TABLE `group_members` (
  `memberID` int(11) NOT NULL,
  `groupID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `joinedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `group_members`
--

INSERT INTO `group_members` (`memberID`, `groupID`, `userID`, `joinedAt`) VALUES
(1, 1, 6, '2024-08-16 19:42:29'),
(6, 1, 7, '2024-08-18 11:57:42');

-- --------------------------------------------------------

--
-- Table structure for table `group_messages`
--

CREATE TABLE `group_messages` (
  `messageID` int(11) NOT NULL,
  `groupID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `message` text NOT NULL,
  `sentAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inbox`
--

CREATE TABLE `inbox` (
  `id` int(11) NOT NULL,
  `senderID` int(11) NOT NULL,
  `recipientID` int(11) NOT NULL,
  `message` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `isRead` tinyint(1) DEFAULT 0,
  `senderUsername` varchar(255) DEFAULT NULL,
  `filePath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inbox`
--

INSERT INTO `inbox` (`id`, `senderID`, `recipientID`, `message`, `timestamp`, `isRead`, `senderUsername`, `filePath`) VALUES
(1, 7, 6, 'danger', '2024-08-10 10:25:09', 1, 'n', NULL),
(2, 6, 7, 'pay back', '2024-08-10 10:25:51', 1, 'T', NULL),
(3, 6, 7, 'check check', '2024-08-10 10:35:01', 1, NULL, NULL),
(4, 6, 7, 'dfgs', '2024-08-10 10:36:33', 1, NULL, NULL),
(5, 6, 7, 'again this ba', '2024-08-10 10:37:03', 1, NULL, NULL),
(6, 6, 7, 'dede', '2024-08-10 10:37:46', 1, NULL, NULL),
(7, 6, 7, 'dddd', '2024-08-10 10:38:03', 1, 'T', NULL),
(8, 6, 7, 'what damn', '2024-08-10 10:39:11', 1, 'T', NULL),
(9, 7, 6, 'mn tired', '2024-08-10 10:39:28', 1, 'n', NULL),
(10, 6, 7, 'hhhh', '2024-08-10 10:40:31', 1, 'T', NULL),
(11, 6, 7, 'again happy', '2024-08-10 10:43:40', 1, 'Test', NULL),
(12, 7, 6, '', '2024-08-10 12:11:23', 1, 'nex', NULL),
(13, 7, 6, '', '2024-08-10 12:11:24', 1, 'nex', NULL),
(14, 7, 6, '', '2024-08-10 12:26:48', 1, 'nex', NULL),
(15, 7, 6, '', '2024-08-10 12:26:51', 1, 'nex', NULL),
(16, 7, 6, '', '2024-08-10 12:55:37', 1, 'nex', NULL),
(17, 7, 6, 'cgdng', '2024-08-10 12:55:54', 1, 'nex', NULL),
(18, 7, 6, '', '2024-08-10 13:49:04', 1, 'nex', NULL),
(19, 7, 6, 'work on image sharing please', '2024-08-10 13:49:27', 1, 'nex', NULL),
(20, 7, 0, 'vp ,m', '2024-08-10 18:58:15', 0, 'nex', NULL),
(21, 7, 6, 'ahh ??', '2024-08-10 18:58:54', 1, 'nex', NULL),
(22, 7, 6, 'tesr svrr', '2024-08-10 19:06:53', 1, 'nex', NULL),
(23, 7, 6, 'agaiiiin', '2024-08-10 19:10:51', 1, 'nex', NULL),
(24, 7, 6, 'nay be it worjws', '2024-08-10 19:21:00', 1, 'nex', NULL),
(25, 7, 6, 'wooow', '2024-08-10 19:21:14', 1, 'nex', NULL),
(26, 7, 6, '231', '2024-08-10 19:21:19', 1, 'nex', NULL),
(27, 6, 7, 'good evening', '2024-08-12 16:03:16', 1, 'Test', NULL),
(28, 6, 7, '????????', '2024-08-12 16:03:57', 1, 'Test', NULL),
(29, 6, 7, 'whats on dude', '2024-08-12 17:52:57', 1, 'Test', NULL),
(30, 7, 6, 'all good budy', '2024-08-12 17:54:10', 1, 'nex', NULL),
(31, 7, 6, 'kk', '2024-08-12 18:06:06', 1, 'nex', NULL),
(32, 6, 7, 'fekkow mibr===jwer', '2024-08-12 18:24:05', 1, 'Test', NULL),
(33, 7, 6, 'hhhhh', '2024-08-12 18:24:30', 1, 'nex', NULL),
(34, 7, 6, 'kkkkk', '2024-08-12 18:25:02', 1, 'nex', NULL),
(35, 7, 6, 'kn.k', '2024-08-12 18:25:19', 1, 'nex', NULL),
(36, 7, 6, 'n;l.j', '2024-08-12 18:25:22', 1, 'nex', NULL),
(37, 6, 7, 'bskds', '2024-08-12 18:26:00', 1, 'Test', NULL),
(38, 6, 7, '', '2024-08-12 18:26:02', 1, 'Test', NULL),
(39, 6, 7, 'sda', '2024-08-12 18:26:06', 1, 'Test', NULL),
(40, 6, 7, 'evening bddy', '2024-08-14 17:53:00', 1, 'Test', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `goodId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `userId`, `goodId`) VALUES
(15, 6, 9),
(16, 6, 10),
(21, 6, 11),
(13, 7, 9),
(19, 7, 10),
(20, 7, 11);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `messageID` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `dateTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`messageID`, `name`, `message`, `dateTime`) VALUES
(24, 'nex', 'hiii there am new here', '2024-08-02 19:13:23'),
(25, 'Test', 'welcome buddy', '2024-08-02 19:13:49'),
(26, 'nex', 'ghkjh', '2024-08-12 18:41:12');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `isRead` tinyint(1) DEFAULT 0,
  `senderID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `userID`, `type`, `message`, `createdAt`, `isRead`, `senderID`) VALUES
(54, 0, 'inbox', 'nex sent you a message: \"vp ,m\"', '2024-08-10 18:58:15', 0, 7),
(71, 7, 'inbox', 'Test sent you a message: \"bskds\"', '2024-08-12 18:26:00', 1, 6),
(72, 7, 'inbox', 'Test sent you a message: \"\"', '2024-08-12 18:26:02', 1, 6),
(73, 7, 'inbox', 'Test sent you a message: \"sda\"', '2024-08-12 18:26:06', 1, 6),
(74, 7, 'inbox', 'Test sent you a message: \"evening bddy\"', '2024-08-14 17:53:00', 1, 6);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('F5NqQp9MCnPUWawbXppO0evJIf8SNv1f', 1724005970, '{\"cookie\":{\"originalMaxAge\":10800000,\"expires\":\"2024-08-18T15:54:20.845Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userID\":7,\"username\":\"nex\"}'),
('JXflTMFAuLX7bUYtIGjSN3TdQsvmuMcM', 1724008696, '{\"cookie\":{\"originalMaxAge\":10800000,\"expires\":\"2024-08-18T19:09:03.947Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userID\":6,\"username\":\"Test\"}'),
('dwcovfXr2feV5VfJcLxz5YGj-v5bJocj', 1724007199, '{\"cookie\":{\"originalMaxAge\":10800000,\"expires\":\"2024-08-18T15:54:40.316Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userID\":6,\"username\":\"Test\"}');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Gender` enum('Male','Female','Other') DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `ProfilePhoto` varchar(255) DEFAULT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `DateAdded` timestamp NOT NULL DEFAULT current_timestamp(),
  `SentBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `Username`, `Email`, `Gender`, `DateOfBirth`, `ProfilePhoto`, `PasswordHash`, `DateAdded`, `SentBy`) VALUES
(6, 'Test', 't@gmail.com', 'Male', NULL, NULL, 't', '2024-08-02 19:08:54', NULL),
(7, 'nex', 'n@gmail.com', 'Female', NULL, NULL, 'n', '2024-08-02 19:12:01', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `goods`
--
ALTER TABLE `goods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`groupID`);

--
-- Indexes for table `group_members`
--
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`memberID`),
  ADD KEY `groupID` (`groupID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `group_messages`
--
ALTER TABLE `group_messages`
  ADD PRIMARY KEY (`messageID`),
  ADD KEY `groupID` (`groupID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `inbox`
--
ALTER TABLE `inbox`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`,`goodId`),
  ADD KEY `goodId` (`goodId`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`messageID`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD KEY `SentBy` (`SentBy`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `goods`
--
ALTER TABLE `goods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `groupID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `group_members`
--
ALTER TABLE `group_members`
  MODIFY `memberID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `group_messages`
--
ALTER TABLE `group_messages`
  MODIFY `messageID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inbox`
--
ALTER TABLE `inbox`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `messageID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `group_messages`
--
ALTER TABLE `group_messages`
  ADD CONSTRAINT `group_messages_ibfk_1` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_messages_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`goodId`) REFERENCES `goods` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`SentBy`) REFERENCES `users` (`UserID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
