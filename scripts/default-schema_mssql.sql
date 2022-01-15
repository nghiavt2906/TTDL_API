
CREATE TABLE auth_users (
  [id] VARCHAR(20) NOT NULL,
  [username] VARCHAR(255) NOT NULL,
  [email] VARCHAR(255) NOT NULL,
  [password] VARCHAR(255) NOT NULL,
  [email_verified_at] DATETIME2(3),
  [alert_email] VARCHAR(255) NOT NULL,
  [phone] VARCHAR(20) NOT NULL,
  [workplace] VARCHAR(255) NOT NULL,
  [position] VARCHAR(255) NOT NULL,
  [role_key] VARCHAR(64) NOT NULL,
  [id_stations] VARCHAR(64) NOT NULL,
  [created_at] DATETIME2(3) NOT NULL,
  [updated_at] DATETIME2(3) NOT NULL,
  [deleted_at] DATETIME2(3),

  PRIMARY KEY ([id])
);

CREATE TABLE auth_tokens (
  [token] VARCHAR(20) NOT NULL,
  [created_at] DATETIME2(3) NOT NULL,
  [type] VARCHAR(255) NOT NULL,
  
  PRIMARY KEY ([token])
);

CREATE TABLE auth_user_access_tokens (
  [id] INT NOT NULL IDENTITY,
  [token] VARCHAR(20) NOT NULL,
  [user_id] INT NOT NULL,
  [description] VARCHAR(max),
  
  PRIMARY KEY ([id])
);
-- Define user role
CREATE TABLE auth_roles(
  [id] INT NOT NULL IDENTITY,
  [name] VARCHAR(255) NOT NULL,
  [display_name] VARCHAR(255),
  [description] VARCHAR(max),

  PRIMARY KEY([id])
);



CREATE TABLE auth_user_role (
  [id] INT NOT NULL IDENTITY,
  [user_id] INT NOT NULL,
  [group_id] INT NOT NULL,

  PRIMARY KEY ([id])
);

CREATE TABLE auth_permission (
  [id] INT NOT NULL IDENTITY,
  [name] VARCHAR(255) NOT NULL,
  [code_name] VARCHAR(255) NOT NULL,
  [description] VARCHAR(max),

  PRIMARY KEY([id])
);


CREATE TABLE auth_group_permission(
  [id] INT NOT NULL IDENTITY,
  [group_id] VARCHAR(255) NOT NULL,
  [permission_id] VARCHAR(255) NOT NULL,

  PRIMARY KEY([id])
);

CREATE TABLE auth_user_permission(
  [id] INT NOT NULL IDENTITY,
  [user_id] INT NOT NULL,
  [permission_id] VARCHAR(255) NOT NULL,
  
  PRIMARY KEY ([id])
);

-- Define user can access control to certain stations
CREATE TABLE auth_stations_user_permission (
  [id] INT NOT NULL IDENTITY,
  [user_id] INT NOT NULL,
  [station_id] VARCHAR(255),

  PRIMARY KEY ([id])
);


CREATE TABLE monitoring_types (
  [id] VARCHAR(20) NOT NULL,
  [name] VARCHAR(255) NOT NULL,
  [symbol] VARCHAR(255) NOT NULL,
  [description] VARCHAR(max),
  [created_at] DATETIME2(3) NOT NULL,
  [updated_at] DATETIME2(3),
  [deleted_at] DATETIME2(3),

  PRIMARY KEY ([id])
);

INSERT INTO monitoring_types VALUES 
  (1, 'Quan trắc nước', 'QTN', 'Quan trắc chất lượng môi trường nước', '2019-10-07', null, null), 
  (2, 'Quan trắc không khí', 'QTK', 'Quan trắc chất lượng không khí', '2019-10-07', null, null);

CREATE TABLE monitoring_groups(
  [id] VARCHAR(20) NOT NULL,
  [name] VARCHAR(255) NOT NULL,
  [monitoring_type_id] INT NOT NULL,
  [symbol] VARCHAR(255) NOT NULL,
  [description] VARCHAR(max),
  [created_at] DATETIME2(3) NOT NULL,
  [updated_at] DATETIME2(3),
  [deleted_at] DATETIME2(3),

  PRIMARY KEY([id])
);

CREATE TABLE stations (
  [id] VARCHAR(20) NOT NULL,
  [name] VARCHAR(255) NOT NULL,
  [station_group_id] INT NOT NULL,
  [symbol] VARCHAR(255) NOT NULL,
  [address] VARCHAR(255) NOT NULL,
  [phone] VARCHAR(20) NOT NULL,
  [root_location] VARCHAR(255),
  [lasted_location] VARCHAR(255),
  [update_location_status] SMALLINT NOT NULL,
  [installed_at] DATETIME2(3),
  [verified_at] DATETIME2(3),
  [verification_organization] VARCHAR(255),
  [emittedFrequency] INT CHECK ([emittedFrequency] > 0) NOT NULL,
  [indicators] VARCHAR(255) NOT NULL,
  [ftp_folder] VARCHAR(255) NOT NULL,
  [ftp_filename] VARCHAR(255) NOT NULL,
  [lasted_sent_at] DATETIME2(3),
  [sendftp_status] SMALLINT NOT NULL,
  [receiveftp_status] SMALLINT NOT NULL,
  [lasted_indicator_over_threshold] VARCHAR(20),
  [number_of_threshold] INT,
  [number_of_alert_threshold] INT,
  [alert_threshold_status] SMALLINT,
  [number_of_alert_structure] INT,
  [alert_sturcture_status] SMALLINT,
  [number_of_disconnection] INT,
  [alert_disconnection_status] SMALLINT,
  [battery] INT CHECK ([battery] > 0),
  [activity_status] SMALLINT,
  [public_status] SMALLINT,
  [created_at] DATETIME2(3) NOT NULL,
  [updated_at] DATETIME2(3) NOT NULL,
  [deleted_at] DATETIME2(3),

  PRIMARY KEY ([id])
);

CREATE TABLE station_cameras (
  [id] VARCHAR(20) NOT NULL,
  [id_station] VARCHAR(255) NOT NULL,
  [host] VARCHAR(100) NOT NULL,
  [post] VARCHAR(10) NOT NULL,
  [username] VARCHAR(50) NOT NULL,
  [password] VARCHAR(255) NOT NULL,
  [rtsp_link] VARCHAR(255) NOT NULL,
  PRIMARY KEY([id])
);


CREATE TABLE station_groups (
  [id] VARCHAR(20) NOT NULL,
  [name] VARCHAR(255) NOT NULL,
  [symbol] VARCHAR(255) NOT NULL,
  [description] VARCHAR(max),
  [created_at] DATETIME2(3) NOT NULL,
  [updated_at] DATETIME2(3),
  [deleted_at] DATETIME2(3),
  
  PRIMARY KEY ([id])
);


CREATE TABLE indicators(
  [id] VARCHAR(20) NOT NULL,
  [name] VARCHAR(255) NOT NULL,
  [id_monitoring_type] VARCHAR(255) NOT NULL,
  [symbol] VARCHAR(255) NOT NULL,
  [unit] VARCHAR(255) NOT NULL,
  [descriptions] VARCHAR(max),

  PRIMARY KEY([id])
);

CREATE TABLE indicator_threshold(
  [id] VARCHAR(20) NOT NULL,
  [indicator_id] INT NOT NULL,
  [station_group_id] INT NOT NULL,
  [upper_limit] INT NOT NULL,
  [lower_limit] INT NOT NULL,
  [hour_limit] INT NOT NULL,
  [safety_description] VARCHAR(max),
  [over_threshold_description] VARCHAR(max),

  PRIMARY KEY ([id])
);

CREATE TABLE monitoring_data_info(
  [id] VARCHAR(20) NOT NULL,
  [station_id] VARCHAR(255),
  [location] VARCHAR(60),
  [battery]  INT CHECK ([battery] > 0),
  [monitoring_content] VARCHAR(500) NOT NULL,
  [sent_at] DATETIME2(3) NOT NULL,
  [created_at] DATETIME2(3) NOT NULL,
  [updated_at] DATETIME2(3),
  [deleted_at] DATETIME2(3),
  [is_ftpdata] SMALLINT,

  PRIMARY KEY ([id])
);

CREATE TABLE monitoring_data(
  [id] VARCHAR(20) NOT NULL,
  [id_monitoring_type] VARCHAR(10) NOT NULL,
  [id_data] VARCHAR(255) NOT NULL,
  [indicator] VARCHAR(20) NOT NULL,
  [value] INT CHECK ([value] > 0) NOT NULL,
  [unit] VARCHAR(20) NOT NULL,
  [sensor_status] VARCHAR(2) NOT NULL,

  PRIMARY KEY ([id])
);



CREATE TABLE sample_history(
  [id] VARCHAR(20) NOT NULL,
  [id_station] VARCHAR(255) NOT NULL,
  [sample_at] DATETIME2(3) NOT NULL,
  [id_user] VARCHAR(255) NOT NULL,

  PRIMARY KEY([id])
);

CREATE TABLE firmwares (
  [id] VARCHAR(20) NOT NULL,
  [name] VARCHAR(100) NOT NULL,
  [version] VARCHAR(50) NOT NULL,
  [firmware_date]  DATETIME2(3) NOT NULL,
  [status] SMALLINT,
  [url] VARCHAR(100) NOT NULL,
  [created_at] DATETIME2(3) NOT NULL,
  [updated_at] DATETIME2(3),
  [deleted_at] DATETIME2(3),

  PRIMARY KEY([id])
);

CREATE TABLE alert_history(
  [id] VARCHAR(20) NOT NULL,
  [id_station] VARCHAR(255) NOT NULL,
  [alert_type] SMALLINT NOT NULL,
  [alert_at]  DATETIME2(3) NOT NULL,
  [indicator] VARCHAR(20),
  [value]  INT CHECK ([value] > 0),
  [unit] VARCHAR(20),

  PRIMARY KEY([id])
);

CREATE TABLE systems (
  [id] VARCHAR(20) NOT NULL,
  [id_system] VARCHAR(255) NOT NULL,
  [name] VARCHAR(255) NOT NULL,
  [value] VARCHAR(max),

  PRIMARY KEY([id])
);

INSERT INTO systems VALUES 
  ('1', '1', 'sms_alert_threshold', 'TTQTMT thong bao: Tram $TENTRAM co chi so $CHISO vuot nguong an toan (vung AT: $NGUONGDUOI-$NGUONGTREN $DONVI). De nghi a/c phu trach tram kiem tra lai. Tran trong!'), 
  ('2', '1', 'sms_alert_disconnection', 'TTQTMT thong bao: Tram $TENTRAM khong truyen du lieu ve trung tam. De nghi a/c phu trach $TENTRAM kiem tra lai. Tran trong!'),
  ('3', '1', 'sms_alert_structure', 'TTQTMT thong bao: Tram $TENTRAM gui file du lieu khong dung cau truc. De nghi a/c phu trach $TENTRAM kiem tra lai. Tran trong!'),
  ('4', '1', 'sms_alert_battery', null),
  ('5', '1', 'title_email_alert_threshold', 'Cảnh báo quan trắc vượt ngưỡng'),
  ('6', '1', 'email_alert_threshold', '<p>Kính gửi anh(chị) phụ trách theo dõi $TENTRAM!<p>
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
  ('7', '1', 'title_email_alert_disconnection', 'Cảnh báo trạm không truyền dữ liệu'),
  ('8', '1', 'email_alert_disconnection', '<p>Kính gửi anh(chị) phụ trách theo dõi $TENTRAM!<p>
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
  ('9', '1', 'title_email_alert_structure', 'Cảnh báo file truyền về không đúng cấu trúc'),
  ('10', '1', 'email_alert_structure', '<p>Kính gửi anh(chị) phụ trách theo dõi $TENTRAM!<p>
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
  ('11', '1', 'title_email_alert_battery', 'Cảnh báo file truyền về không đúng cấu trúc'),
  ('12', '1', 'email_alert_battery', null),
  ('13', '1', 'number_of_alert_sms', '5'),
  ('14', '1', 'number_of_alert_email', '5'),
  ('15', '1', 'alert_sms_status', '0'),
  ('16', '1', 'alert_email_status', '0'),
  ('17', '1', 'param_threshold_firstlevel', '5'),
  ('18', '1', 'param_threshold_secondlevel', '10'),
  ('19', '1', 'param_disconnection_firstlevel', '60'),
  ('20', '1', 'param_disconnection_secondlevel', '120'),
  ('21', '1', 'alert_structure_status', '1'),
  ('22', '1', 'ftpserver_stnmt', null),
  ('23', '1', 'ftpusername_stnmt', null),
  ('24', '1', 'ftppassword_stnmt', null),
  ('25', '1', 'ftpserver_btnmt', null),
  ('26', '1', 'ftpusername_btnmt', null),
  ('27', '1', 'dir_receive_ftp', '/ArriveFiles'),
  ('28', '1', 'dir_save_ftp', '/DataFiles'),
  ('29', '1', 'dir_wrong_ftp', '/ErrorFiles'),
  ('30', '1', 'upper_threshold_color', 'red'),
  ('31', '1', 'lower_threshold_color', 'red'),
  ('32', '1', 'warning_threshold_color', 'red'),
  ('33', '1', 'safety_threshold_color', 'green'),
  ('34', '1', 'mail_server', 'huutin25021993@gmail.com'),
  ('35', '1', 'mail_password', null),
  ('36', '1', 'mail_servername', 'Trung tâm Quan trắc Môi trường'),
  ('37', '1', 'mail_client_id', '590257600088-se1msnnvb9jd57nv3b8322f1mv1dm36r.apps.googleusercontent.com'),
  ('38', '1', 'mail_client_secret', 'ZELxuqPeJfL8MkEt9OLbz21h'),
  ('39', '1', 'mail_refresh_token', '1/EmmooZsWXI4mFEgbbGuUgUryTFnDMeu-bLsXP_Co5D8'),
  ('40', '1', 'mail_access_token', 'ya29.GltrBxFxaGeWny8Xso2cXpTCuYTOSOniIe73I6UVrxm5YqomyYfSYuuEoLSTP6FiDG8TyPwn_fHz2My-AUPki0zXuwL0BqhtG65DRmMPssxyogARqDn2xhN1QbuL'),
  ('41', '1', 'sms_server', 'http://49.156.52.24:5993/SmsService.asmx'),
  ('42', '1', 'sms_username', 'centic'),
  ('43', '1', 'sms_password', 'oipd645xlcj7va5');

CREATE TABLE station_followers (
  [id] VARCHAR(20) NOT NULL,
  [id_user] VARCHAR(20) NOT NULL,
  [id_station] VARCHAR(20) NOT NULL

  PRIMARY KEY(`id`)
);

CREATE TABLE station_indicators (
  [id] VARCHAR(20) NOT NULL,
  [id_station] VARCHAR(20) NOT NULL,
  [id_indicator] VARCHAR(20) NOT NULL,
  [alert_status] SMALLINT,

  PRIMARY KEY([id])
);