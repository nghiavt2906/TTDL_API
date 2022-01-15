DROP DATABASE IF EXISTS `quantracmoitruong`;

CREATE DATABASE `quantracmoitruong` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `quantracmoitruong`;


-- Tin
CREATE TABLE IF NOT EXISTS `auth_users` (
  `id` VARCHAR(20) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email_verified_at` DATETIME(3),
  `alert_email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `workplace` VARCHAR(255) NOT NULL,
  `position` VARCHAR(255) NOT NULL,
  `is_god` TINYINT(1) NOT NULL,
  -- `role_key` VARCHAR(64) NOT NULL,
  -- `id_stations` VARCHAR(64) NOT NULL,
  `created_at` DATETIME(3) NOT NULL,
  `updated_at` DATETIME(3) NOT NULL,
  `deleted_at` DATETIME(3),

  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `auth_tokens` (
  `token` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(3) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  
  PRIMARY KEY (`token`)
);

CREATE TABLE IF NOT EXISTS `auth_user_access_tokens` (
  `id` VARCHAR(20) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `description` LONGTEXT,
  
  PRIMARY KEY (`id`)
);
-- Define user role
CREATE TABLE IF NOT EXISTS `auth_roles`(
  `id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(255),
  `description` TEXT,
  `permission` TEXT,

  PRIMARY KEY(`id`)
);

INSERT INTO `auth_roles` VALUES 
  ('b4zW8q0XnQPDfmpoDOy2', 'god', 'authentication.roles.god', null, ``), 
  ('wuuS2BE7gV5BDhwIL7Em', 'admin', 'authentication.roles.admin', null, ``), 
  ('5VqPomXM73PWqYKXzYwk', 'station_supervisor', 'authentication.roles.station_supervisor', null, ``), 
  ('dug161VWGgQYiWseEqBu', 'normal_user', 'authentication.roles.normal_user', null, `view_latest_data_page view_table_data_page view_chart_data_page view_map_station_page view_sation_info_page`);

CREATE TABLE IF NOT EXISTS `auth_user_role` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64),
  `role_id` VARCHAR(64),

  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `auth_permission` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `code_name` VARCHAR(255) NOT NULL,
  `description` LONGTEXT,

  PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` VARCHAR(20) NOT NULL,
  `managerId` VARCHAR(20) NOT NULL,
  `activityType` VARCHAR(20) NOT NULL,
  `dataType` VARCHAR(20) NOT NULL,
  `handleAt` DATETIME(3) NOT NULL,
  `dataId` VARCHAR(20) NOT NULL

  PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `auth_role_permission`(
  `id` VARCHAR(64) NOT NULL,
  `role_id` VARCHAR(255) NOT NULL,
  `permission_id` VARCHAR(255) NOT NULL,

  PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `auth_user_permission`(
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `permission_id` VARCHAR(255) NOT NULL,
  
  PRIMARY KEY (`id`)
);

-- Define user can access control to certain stations
CREATE TABLE IF NOT EXISTS `auth_stations_user_permission` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64),
  `station_id` VARCHAR(255),

  PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `monitoring_types` (
  `id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `symbol` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `created_at` DATETIME(3) NOT NULL,
  `updated_at` DATETIME(3),
  `deleted_at` DATETIME(3),

  PRIMARY KEY (`id`)
);

INSERT INTO `monitoring_types` VALUES 
  (1, 'Quan trắc nước', 'QTN', 'Quan trắc chất lượng môi trường nước', '2019-10-07', null, null), 
  (2, 'Quan trắc không khí', 'QTK', 'Quan trắc chất lượng không khí', '2019-10-07', null, null);

CREATE TABLE IF NOT EXISTS `monitoring_groups`(
  `id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `monitoring_type_id` INT NOT NULL,
  `symbol` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `created_at` DATETIME(3) NOT NULL,
  `updated_at` DATETIME(3),
  `deleted_at` DATETIME(3),

  PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `stations` (
  `id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `station_group_id` INT NOT NULL,
  `symbol` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `root_location` VARCHAR(255),
  `lasted_location` VARCHAR(255),
  `update_location_status` TINYINT NOT NULL,
  `installed_at` DATETIME(3),
  `verified_at` DATETIME(3),
  `verification_organization` VARCHAR(255),
  `emittedFrequency` INT UNSIGNED NOT NULL,
  `indicators` VARCHAR(255) NOT NULL,
  `ftp_folder` VARCHAR(255) NOT NULL,
  `ftp_filename` VARCHAR(255) NOT NULL,
  `lasted_sent_at` DATETIME(3),
  `sendftp_status` TINYINT NOT NULL,
  `receiveftp_status` TINYINT NOT NULL,
  `lasted_indicator_over_threshold` VARCHAR(20),
  `number_of_threshold` INT,
  `number_of_alert_threshold` INT,
  `alert_threshold_status` TINYINT,
  `number_of_alert_structure` INT,
  `alert_sturcture_status` TINYINT,
  `number_of_disconnection` INT,
  `alert_disconnection_status` TINYINT,
  `battery` INT UNSIGNED,
  `activity_status` TINYINT,
  `public_status` TINYINT,
  `created_at` DATETIME(3) NOT NULL,
  `updated_at` DATETIME(3) NOT NULL,
  `deleted_at` DATETIME(3),

  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `station_cameras` (
  `id` VARCHAR(20) NOT NULL,
  `id_station` VARCHAR(255) NOT NULL,
  `host` VARCHAR(100) NOT NULL,
  `post` VARCHAR(10) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `rtsp_link` VARCHAR(255) NOT NULL,
  PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `station_groups` (
  `id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `symbol` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `created_at` DATETIME(3) NOT NULL,
  `updated_at` DATETIME(3),
  `deleted_at` DATETIME(3),
  
  PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `indicators`(
  `id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `id_monitoring_type` VARCHAR(255) NOT NULL,
  `symbol` VARCHAR(255) NOT NULL,
  `unit` VARCHAR(255) NOT NULL,
  `description` TEXT,

  PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `indicator_threshold`(
  `id` VARCHAR(20) NOT NULL,
  `indicator_id` INT NOT NULL,
  `station_group_id` INT NOT NULL,
  `upper_limit` INT NOT NULL,
  `lower_limit` INT NOT NULL,
  `hour_limit` INT NOT NULL,
  `safety_description` TEXT,
  `over_threshold_description` TEXT,

  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `monitoring_data_info`(
  `id` VARCHAR(20) NOT NULL,
  `station_id` VARCHAR(255),
  `location` VARCHAR(60),
  `battery`  INT UNSIGNED,
  `monitoring_content` VARCHAR(500) NOT NULL,
  `sent_at` DATETIME(3) NOT NULL,
  `created_at` DATETIME(3) NOT NULL,
  `updated_at` DATETIME(3),
  `deleted_at` DATETIME(3),
  `is_ftpdata` TINYINT,

  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `monitoring_data`(
  `id` VARCHAR(20) NOT NULL,
  `id_monitoring_type` VARCHAR(10) NOT NULL,
  `id_data` VARCHAR(255) NOT NULL,
  `indicator` VARCHAR(20) NOT NULL,
  `value` INT UNSIGNED NOT NULL,
  `unit` VARCHAR(20) NOT NULL,
  `sensor_status` VARCHAR(2) NOT NULL,

  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `monitoring_data`(
  `id` VARCHAR(20) NOT NULL,
  `id_monitoring_type` VARCHAR(10) NOT NULL,
  `id_data` VARCHAR(255) NOT NULL,
  `indicator` VARCHAR(20) NOT NULL,
  `value` INT UNSIGNED NOT NULL,
  `unit` VARCHAR(20) NOT NULL,
  `sensor_status` VARCHAR(2) NOT NULL,

  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `sample_history`(
  `id` VARCHAR(20) NOT NULL,
  `id_station` VARCHAR(255) NOT NULL,
  `sample_at` DATETIME(3) NOT NULL,
  `id_user` VARCHAR(255) NOT NULL,

  PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `firmwares` (
  `id` VARCHAR(20) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `version` VARCHAR(50) NOT NULL,
  `firmware_date`  DATETIME(3) NOT NULL,
  `status` TINYINT,
  `url` VARCHAR(100) NOT NULL,
  `created_at` DATETIME(3) NOT NULL,
  `updated_at` DATETIME(3),
  `deleted_at` DATETIME(3),

  PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `alert_history`(
  `id` VARCHAR(20) NOT NULL,
  `id_station` VARCHAR(255) NOT NULL,
  `alert_type` TINYINT NOT NULL,
  `alert_at`  DATETIME(3) NOT NULL,
  `indicator` VARCHAR(20),
  `value`  INT UNSIGNED,
  `unit` VARCHAR(20),

  PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `systems` (
  -- `id` VARCHAR(20) NOT NULL,
  -- `id_system` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `value` TEXT,

  PRIMARY KEY(`name`)
);

INSERT INTO `systems` VALUES 
  ('sms_alert_threshold', 'TTQTMT thong bao: Tram $TENTRAM co chi so $CHISO vuot nguong an toan (vung AT: $NGUONGDUOI-$NGUONGTREN $DONVI). De nghi a/c phu trach tram kiem tra lai. Tran trong!'), 
  ('sms_alert_disconnection', 'TTQTMT thong bao: Tram $TENTRAM khong truyen du lieu ve trung tam. De nghi a/c phu trach $TENTRAM kiem tra lai. Tran trong!'),
  ('sms_alert_structure', 'TTQTMT thong bao: Tram $TENTRAM gui file du lieu khong dung cau truc. De nghi a/c phu trach $TENTRAM kiem tra lai. Tran trong!'),
  ('sms_alert_battery', null),
  ('title_email_alert_threshold', 'Cảnh báo quan trắc vượt ngưỡng'),
  ('email_alert_threshold', '<p>Kính gửi anh(chị) phụ trách theo dõi $TENTRAM!<p>
                                      </br>
                                      <p>$TRUNGTAM gửi email cảnh báo vượt ngưỡng quan trắc môi trường.Cụ thể:</p>
                                      </br>
                                      <p>- Tên trạm: $TENTRAM</p>
                                      <p>- Ký hiệu trạm: $KYHIEUTRAM</p>
                                      <p>- Loại quan trắc: $NHOMQUANTRAC</p>
                                      <p>- Chỉ số $CHISO hiện tại: $KETQUA $DONVI</p>
                                      <p>- Vùng $CHISO an toàn: $NGUONGDUOI-$NGUONGTREN $DONVI</p>
                                      <p>- Thời gian đo: $THOIGIANDO</p>
                                      </br>
                                      <p>Đề nghị anh(chị) theo dõi và xử lý vượt ngưỡng tại trạm $TENTRAM</p>
                                      </br>
                                      <p>Trân trọng,</p> 
                                      <p>$TRUNGTAM</p>'),
  ( 'title_email_alert_disconnection', 'Cảnh báo trạm không truyền dữ liệu'),
  ('email_alert_disconnection', '<p>Kính gửi anh(chị) phụ trách theo dõi $TENTRAM!<p>
                                          </br>
                                          <p>$TRUNGTAM gửi email cảnh báo Trạm không truyền dữ liệu.Cụ thể:</p>
                                          </br>
                                          <p>- Tên trạm: $TENTRAM</p>
                                          <p>- Ký hiệu trạm: $KYHIEUTRAM</p>
                                          <p>- Loại quan trắc: $NHOMQUANTRAC</p>
                                          <p>- Lỗi: Trạm không truyền dữ liệu về</p>
                                          </br>
                                          <p>Đề nghị anh(chị) theo dõi và rà soát lại dữ liệu gửi về của trạm $TENTRAM</p>
                                          </br>
                                          <p>Trân trọng,</p>
                                          <p>$TRUNGTAM</p>'),
  ('title_email_alert_structure', 'Cảnh báo file truyền về không đúng cấu trúc'),
  ('email_alert_structure', '<p>Kính gửi anh(chị) phụ trách theo dõi $TENTRAM!<p>
                                        </br>
                                        <p>$TRUNGTAM gửi email cảnh báo dữ liệu gửi về không đúng cấu trúc.Cụ thể:</p>
                                        </br>
                                        <p>- Tên trạm: $TENTRAM</p>
                                        <p>- Ký hiệu trạm: $KYHIEUTRAM</p>
                                        <p>- Loại quan trắc: $NHOMQUANTRAC</p>
                                        <p>- Lỗi: File ftp gửi về không đúng cấu trúc</p>
                                        </br>
                                        <p>Đề nghị anh(chị) theo dõi và rà soát lại dữ liệu gửi về của trạm $TENTRAM</p>
                                        </br>
                                        <p>Trân trọng,</p>
                                        <p>$TRUNGTAM</p>'),
  ('title_email_alert_battery', 'Cảnh báo file truyền về không đúng cấu trúc'),
  ('email_alert_battery', null),
  ('number_of_alert_sms', '5'),
  ('number_of_alert_email', '5'),
  ('alert_sms_status', '0'),
  ('alert_email_status', '0'),
  ('param_threshold_firstlevel', '5'),
  ('param_threshold_secondlevel', '10'),
  ('param_disconnection_firstlevel', '60'),
  ('param_disconnection_secondlevel', '120'),
  ('alert_structure_status', '1'),
  ('ftpserver_stnmt', null),
  ('ftpusername_stnmt', null),
  ('ftppassword_stnmt', null),
  ('ftpserver_btnmt', null),
  ('ftpusername_btnmt', null),
  ('dir_receive_ftp', '/ArriveFiles'),
  ('dir_save_ftp', '/DataFiles'),
  ('dir_wrong_ftp', '/ErrorFiles'),
  ('upper_threshold_color', 'red'),
  ('lower_threshold_color', 'red'),
  ('warning_threshold_color', 'red'),
  ('safety_threshold_color', 'green'),
  ('mail_server', 'huutin25021993@gmail.com'),
  ('mail_password', null),
  ('mail_servername', 'Trung tâm Quan trắc Môi trường'),
  ('mail_client_id', '590257600088-se1msnnvb9jd57nv3b8322f1mv1dm36r.apps.googleusercontent.com'),
  ('mail_client_secret', 'ZELxuqPeJfL8MkEt9OLbz21h'),
  ('mail_refresh_token', '1/EmmooZsWXI4mFEgbbGuUgUryTFnDMeu-bLsXP_Co5D8'),
  ('mail_access_token', 'ya29.GltrBxFxaGeWny8Xso2cXpTCuYTOSOniIe73I6UVrxm5YqomyYfSYuuEoLSTP6FiDG8TyPwn_fHz2My-AUPki0zXuwL0BqhtG65DRmMPssxyogARqDn2xhN1QbuL'),
  ('sms_server', 'http://49.156.52.24:5993/SmsService.asmx'),
  ('sms_username', 'centic'),
  ('sms_password', 'oipd645xlcj7va5');