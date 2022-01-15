INSERT INTO `monitoring_types` (`id`, `name`, `symbol`, `description`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
('QTK', 'Quan trắc không khí', 'QTK', '', NULL, '2020-04-01 10:19:33', '2020-04-01 10:19:33'),
('QTN', 'Quan trắc nước', 'QTN', '', NULL, '2020-04-01 10:19:33', '2020-04-01 10:19:33');

INSERT INTO `monitoring_groups` (`id`, `name`, `monitoringType`, `symbol`, `description`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
('96uhrqbLC02Q9tjMwPbH', 'Quan trắc khí thải', 'QTK', 'QTKT', 'Quan trắc khí thải tại các khu công nghiệp', NULL, '2020-04-01 10:19:33', '2020-04-01 10:19:33'),
('beTbLaY3J5iLyA2H3GeR', 'Quan trắc nước sinh hoạt', 'QTN', 'QTNSH', 'Quan trắc nước sinh hoạt trong hộ gia đình', NULL, '2020-04-01 10:19:33', '2020-04-01 10:19:33'),
('cNH7rGlPAQzEVsdLaopE', 'Quan trắc nước mặt', 'QTN', 'QTNM', 'Quan trắc nước mặt, sông suối, ao hồ', NULL, '2020-04-01 10:19:33', '2020-04-01 10:19:33'),
('iCXwberyd08CDMLPEPtI', 'Quan trắc khí xung quanh', 'QTK', 'QTKXQ', 'Quan trắc khí xung quanh đô thị, đường phố	', NULL, '2020-04-01 10:19:33', '2020-04-01 10:19:33'),
('p1R0HGiFGdyZFBuLse5b', 'Quan trắc nước ngầm', 'QTN', 'QTNN', 'Quan trắc nước ngầm', NULL, '2020-04-01 10:19:33', '2020-04-01 10:19:33'),
('XTuSjubAZ2OZPiZg4zpc', 'Quan trắc nước thải', 'QTN', 'QTNT', 'Quan trắc nước thải', NULL, '2020-04-01 10:19:33', '2020-04-01 10:19:33');

INSERT INTO `districts` (`id`, `name`, `symbol`) VALUES
('11BT7sDLvwZYZT161Mex', 'Quận 1', 'QUAN1'),
('22BT7sDLvwZYZT161Mex', 'Quận 2', 'QUAN2'),
('33BT7sDLvwZYZT161Mex', 'Quận 3', 'QUAN3'),
('44BT7sDLvwZYZT161Mex', 'Quận 4', 'QUAN4'),
('55BT7sDLvwZYZT161Mex', 'Quận 5', 'QUAN5'),
('66BT7sDLvwZYZT161Mex', 'Quận 6', 'QUAN6'),
('77BT7sDLvwZYZT161Mex', 'Quận 7', 'QUAN7'),
('88BT7sDLvwZYZT161Mex', 'Quận 8', 'QUAN8'),
('99BT7sDLvwZYZT161Mex', 'Quận 9', 'QUAN9'),
('aaBT7sDLvwZYZT161Mex', 'Quận 10', 'QUAN10'),
('bbBT7sDLvwZYZT161Mex', 'Quận 11', 'QUAN11'),
('ccBT7sDLvwZYZT161Mex', 'Quận 12', 'QUAN12'),
('ddBT7sDLvwZYZT161Mex', 'Quận Bình Tân', 'QUANBINHTAN'),
('eeBT7sDLvwZYZT161Mex', 'Quận Bình Thuận', 'QUANBINHTHUAN'),
('ffBT7sDLvwZYZT161Mex', 'Quận Gò Vấp', 'QUANGOVAP'),
('ggBT7sDLvwZYZT161Mex', 'Quận Tân Bình', 'QUANTANBINH'),
('hhBT7sDLvwZYZT161Mex', 'Quận Phú Nhuận', 'QUANPHUNHUAN'),
('iiBT7sDLvwZYZT161Mex', 'Quận Tân Phú', 'QUANTANPHU'),
('nnBT7sDLvwZYZT161Mex', 'Quận Hóc Môn', 'QUANHOCMON'),
('ooBT7sDLvwZYZT161Mex', 'Quận Thủ Đức', 'QUANTHUDUC'),
('ppBT7sDLvwZYZT161Mex', 'Quận Bình Chánh', 'QUANBINHCHANH'),
('ttBT7sDLvwZYZT161Mex', 'Quận Củ Chi', 'QUANCUCHI'),
('yyBT7sDLvwZYZT161Mex', 'Quận Cần Giờ', 'QUANCANGIO');

