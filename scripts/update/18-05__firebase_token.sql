CREATE TABLE `firebase_tokens` (
  `id` varchar(20) NOT NULL,
  `citizenId` varchar(20) NOT NULL,
  `token` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `firebase_tokens` 
  ADD PRIMARY KEY (`id`),
  ADD KEY `citizenId` (`citizenId`);

ALTER TABLE `citizens` ADD PRIMARY KEY (`id`)

ALTER TABLE `firebase_tokens` ADD FOREIGN KEY(`citizenId`) REFERENCES citizens(`id`);

CREATE TABLE `citizen_notifications` (
  `id` varchar(20) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `receiverId` varchar(20) NOT NULL,
  `notificationId` varchar(20) NOT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `citizen_notifications` 
  ADD PRIMARY KEY (`id`),
  ADD KEY `receiverId` (`receiverId`),
  ADD KEY `notificationId` (`notificationId`);

ALTER TABLE `citizen_notifications` 
  ADD CONSTRAINT `citizen_notifications_ibfk_1` FOREIGN KEY (`receiverId`) REFERENCES `citizens` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `citizen_notifications_ibfk_2` FOREIGN KEY (`notificationId`) REFERENCES `notifications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE `citizen_password_recovery` (
  `id` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `code` varchar(6) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `citizen_password_recovery` 
  ADD PRIMARY KEY (`id`)


CREATE TABLE `citizen_password_recovery` (
  `id` varchar(20) NOT NULL,
  `stationId` varchar(20) NOT NULL,
  `activeState` varchar(50) NOT NULL,
  `envIndex` float,
  `latestSentAt` varchar(50) NOT NULL,
  `sendftpStatus` varchar(50) NOT NULL,
  `latestOverThreshold` varchar(50) NOT NULL,
  `numberOfOverThreshold` varchar(50) NOT NULL,
  `numberOfAlertThreshold` varchar(50) NOT NULL,
  `alertThresholdStatus` varchar(50) NOT NULL,
  `numberOfAlertStructure` varchar(50) NOT NULL,
  `alertStructureStatus` varchar(50) NOT NULL,
  `numberOfDisconnection` varchar(50) NOT NULL,
  `alertDisconnectionStatus` varchar(50) NOT NULL,
  `disconnectionTime` interger NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `station_auto_parameters` (
  `id` varchar(20) NOT NULL,
  `stationId` varchar(20) NOT NULL,
  `activeState` varchar(50) NOT NULL DEFAULT 'NORMAL',
  `envIndex` int DEFAULT '-1',
  `latestSentAt` datetime DEFAULT NULL,
  `sendftpStatus` tinyint NOT NULL DEFAULT '1',
  `receiveftpStatus` tinyint NOT NULL DEFAULT '0',
  `lastedIndicatorOverThreshold` varchar(20) DEFAULT NULL,
  `numberOfThreshold` int DEFAULT '0',
  `numberOfAlertThreshold` int DEFAULT '0',
  `alertThresholdStatus` tinyint DEFAULT '1',
  `numberOfAlertStructure` int DEFAULT '0',
  `alertStructureStatus` tinyint DEFAULT '1',
  `numberOfDisconnection` int DEFAULT '0',
  `alertDisconnectionStatus` tinyint DEFAULT '1',
  `disconnectionTime` int DEFAULT '60',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `stations`
--
ALTER TABLE `station_auto_parameters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stationId` (`stationId`)

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `stations`
--
ALTER TABLE `station_auto_parameters`
  ADD CONSTRAINT `station_auto_parameters_ibfk_1` FOREIGN KEY (`stationId`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
COMMIT;


CREATE TABLE `citizen_social_login` (
  `id` varchar(20) NOT NULL,
  `citizenId` varchar(20) NOT NULL,
  `socialId` varchar(255) NOT NULL,
  `loginType` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `stations`
--
ALTER TABLE `citizen_social_login`
  ADD PRIMARY KEY (`id`),
  ADD KEY `citizenId` (`citizenId`)

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `stations`
--
ALTER TABLE `citizen_social_login`
  ADD CONSTRAINT `citizen_social_login_ibfk_1` FOREIGN KEY (`citizenId`) REFERENCES `citizens` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
COMMIT;