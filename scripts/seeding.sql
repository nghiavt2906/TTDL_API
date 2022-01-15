INSERT INTO monitoring_types
VALUES
  ('ia8KrqVeiFEGYgTdhqBx', N'Quan trắc nước', 'QTN', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('3mCZ3XeljK8ngpZ9TdTr', N'Quan trắc không khí', 'QTK', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO monitoring_groups
VALUES
  ('96uhrqbLC02Q9tjMwPbH', N'Quan trắc khí thải', 'QTK', 'QTKT', N'Quan trắc khí thải tại các khu công nghiệp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('beTbLaY3J5iLyA2H3GeR', N'Quan trắc nước sinh hoạt', 'QTN', 'QTNSH', N'Quan trắc nước sinh hoạt trong hộ gia đình', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cNH7rGlPAQzEVsdLaopE', N'Quan trắc nước mặt', 'QTN', 'QTNM', N'Quan trắc nước mặt, sông suối, ao hồ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('iCXwberyd08CDMLPEPtI', N'Quan trắc khí xung quanh', 'QTK', 'QTKXQ', N'Quan trắc khí xung quanh đô thị, đường phố	', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('XTuSjubAZ2OZPiZg4zpc', N'Quan trắc nước thải', 'QTN', 'QTNT', N'Quan trắc nước thải', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO indicators VALUES 
('0cxS4VcRuaS17F7vhN0D',	'TMP',	'QTK',	'TMP', 	'oC', ''),	
('1VShp3DqGd9NSLLbavBK',	'TMP',	'QTN',	'TMP',	'oC',	N'Nhiệt độ'),
('56GgjhXp43IIxoRFc7Yl',	'Hướng gió',	'QTK',	'WD',	'Deg',	N'Hướng gió'),
('bKQCfwFLq7SZ1U8iX0iC',	'COD', 	'QTN',	'COD',	'mg/l',	N'Nồng độ COD'),
('cLEtKPGFPGXWiyn0wAiA',	'PM2.5',	'QTK',	'PM25',	'PPM', ''),	
('emyzT0NiSVNQRnJzbDBC',	'Ozon',	'QTK',	'O3',	'PPM', ''),
('fI8Dfk3eN0eEOQ6nz3Di',	'SO2',	'QTK',	'SO2',	'PPM',	'SO2'),
('HMdhlulrYzviyeAmSevW',	'NO2',	'QTK',	'NO2',	'PPM',	'NO2'),
('HZRtXK5QYiUGjgO7NRZy',	N'Tốc độ gió giật',	'QTK',	'WSG',	'kph',	N'Tốc độ gió giật'),
('i26vWIyFl05Ecujsn5BR',	'PM10',	'QTK',	'PM10',	'PPM', ''),	
('J0ZJ4wGE1K9b1yWPA1AA',	'DO',	'QTN',	'DO',	'mg/l',	N'Nồng độ DO'),
('Lfbfh2vAUjNAcvki3JP5',	N'Tốc độ gió',	'QTK',	'WS',	'kph',	N'Tốc độ gió'),
('LgVUIVDaFcbrqPBn44vc',	N'Áp suất',	'QTK',	'PRESS',	'PA',	N'Áp suất'), 
('LO27zW7EG51OT0NvioAM',	N'Độ ẩm',	'QTK',	'HUMI',	'%', ''),	
('lygl115ZhbwHtFFcfZ1o',	'PM4.0',	'QTK',	'PM4',	'PPM', ''	),
('m9Bgth2ILQle2nJo5Qzi',	'CO',	'QTK',	'CO',	'PPM', ''),	
('QTwS5uidRRmwlsPmS11g',	'PH',	'QTN',	'PH',	'Nồng độ', 'PH'),
('sldZ6xPLVMHf1HfhMTW1',	'TSS',	'QTN',	'TSS',	'mg/l',	N'Nồng độ TSS'),
('vEqph5mgGSxZDt3tVIR8',	'PM1.0',	'QTK',	'PM1',	'PPM', ''),	
('wpMTAZLKUmYHFbZ6oRwy',	'NH4+N',	'QTN',	'NH4',	'mg/l',	N'Nồng độ amoniac trong nước'),
('Yb7XPS06OCKwqIPa9waw',	N'Hướng gió giật',	'QTK',	'WDG', 	'Deg',	N'Hướng gió giật');

INSERT INTO indicator_threshold
VALUES
  ('3xKWkUUARmwnO41tfPoo', 'QTK', 'Lfbfh2vAUjNAcvki3JP5', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, '', ''),
  ('5eUmTnzcrluFwkwQSVV7', 'QTK', 'lygl115ZhbwHtFFcfZ1o', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, '', '') ,
  ('5u4DxrnzIM4BItmls5Wv', 'QTK', 'vEqph5mgGSxZDt3tVIR8', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, '', ''),
  ('882WqL4KFrqNYlVEqLVn', 'QTK', 'LgVUIVDaFcbrqPBn44vc', '96uhrqbLC02Q9tjMwPbH', 300000, 0, NULL, '', ''),
  ('a4hfyus1e4GXirP3bWZG', 'QTK', 'cLEtKPGFPGXWiyn0wAiA', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, '', ''),
  ('BFOnUnuhJz3evxksQ9Ya', 'QTK', 'LgVUIVDaFcbrqPBn44vc', 'iCXwberyd08CDMLPEPtI', 300000, 0, NULL, '', ''),
  ('BoY1nfMTc5o1J4WnELyC', 'QTK', 'HMdhlulrYzviyeAmSevW', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, '', ''),
  ('bwUgYCHaTPg0qPvKW7zT', 'QTK', 'Yb7XPS06OCKwqIPa9waw', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, '', ''),
  ('CkUyv12M0vPKhTHky0Qh', 'QTK', 'LO27zW7EG51OT0NvioAM', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, '', ''),
  ('d3zPRPOo9YuoGKO9PHIz', 'QTK', 'emyzT0NiSVNQRnJzbDBC', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, '', ''),
  ('DSMoqbqkHOOUbghdWBE8', 'QTK', 'vEqph5mgGSxZDt3tVIR8', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, '', ''),
  ('ebjnNYLTdDgAcIUxslgu', 'QTK', 'fI8Dfk3eN0eEOQ6nz3Di', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, '', ''),
  ('Es0UdaZoJpbYQsB5gQR1', 'QTK', 'fI8Dfk3eN0eEOQ6nz3Di', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, '', ''),
  ('g1WxMgLPH0UPctwX0j2y', 'QTK', 'HMdhlulrYzviyeAmSevW', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, '', ''),
  ('k51X5UV1PskypXqLq2jo', 'QTK', 'cLEtKPGFPGXWiyn0wAiA', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, '', ''),
  ('LBlvVz3ugkyu1KmvROZx', 'QTK', 'i26vWIyFl05Ecujsn5BR', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, '', ''),
  ('mHKierSOt5dvilpZItaN', 'QTK', 'Yb7XPS06OCKwqIPa9waw', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, '', ''),
  ('OJULocC23A0sVI3ioROU', 'QTK', 'Lfbfh2vAUjNAcvki3JP5', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, '', ''),
  ('pT47yxXMIQMYt53OmcmB', 'QTK', 'm9Bgth2ILQle2nJo5Qzi', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, '', ''),
  ('QJ9SgZnHZWvYhjdkevBD', 'QTK', 'lygl115ZhbwHtFFcfZ1o', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, '', ''),
  ('qlSehcZHsCCL27WbATAT', 'QTK', 'emyzT0NiSVNQRnJzbDBC', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, '', ''),
  ('SG0tTSOVJ0dYMi0fLC1i', 'QTK', 'i26vWIyFl05Ecujsn5BR', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, '', ''),
  ('sKhV1Mtc25kif7Hv9OyI', 'QTK', 'LO27zW7EG51OT0NvioAM', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, '', ''),
  ('vA31D9eeGP4GCiMX6MwO', 'QTK', 'm9Bgth2ILQle2nJo5Qzi', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, '', ''),
  ('vxfOJPLMDQYDNNNIMyEV', 'QTK', 'HZRtXK5QYiUGjgO7NRZy', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, '', ''),
  ('XiGo3KvIZNe995b5lNTZ', 'QTK', 'HZRtXK5QYiUGjgO7NRZy', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, '', ''),
  ('DK79An7cvaER6qEicvYh', 'QTK', '56GgjhXp43IIxoRFc7Yl', '96uhrqbLC02Q9tjMwPbH', 30000, 0, NULL, N'Hướng gió vùng an toàn', N'Hướng gió vùng cảnh báo'),
  ('epqOAYx8tspuyveKApdi', 'QTN', 'wpMTAZLKUmYHFbZ6oRwy', 'beTbLaY3J5iLyA2H3GeR', 3, 0, NULL, N'NH4+N trong vùng an toàn', N'NH4+N trong vùng cảnh báo'),
  ('eq7ULhnVqknZ0FsgHXJd', 'QTK', '0cxS4VcRuaS17F7vhN0D', 'iCXwberyd08CDMLPEPtI', 40, 20, NULL, N'Nhiệt độ vùng an toàn', N'Nhiệt độ vùng cảnh báo'),
  ('Ex2FI6yfdFHFbTbkPwm8', 'QTN', 'sldZ6xPLVMHf1HfhMTW1', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, NULL, N'TSS trong vùng an toàn', N'TSS trong vùng cảnh báo'),
  ('hFEgsauqqpVAhfyRIl5c', 'QTN', 'QTwS5uidRRmwlsPmS11g', 'cNH7rGlPAQzEVsdLaopE', 9, 5.5, NULL, N'PH trong vùng an toàn', N'PH trong vùng cảnh báo'),
  ('hYQoox1Wyr70vNh5EvxE', 'QTN', 'J0ZJ4wGE1K9b1yWPA1AA', 'beTbLaY3J5iLyA2H3GeR', 2, 0, NULL, N'DO trong vùng an toàn', N'DO trong vùng cảnh báo'),
  ('I6251N3ciSPfiV9HoeXg', 'QTN', '1VShp3DqGd9NSLLbavBK', 'XTuSjubAZ2OZPiZg4zpc', 35, 20, NULL, N'Nhiệt độ trong vùng an toàn', N'Nhiệt độ trong vùng cảnh báo'),
  ('jAMLfYMbBqkTP3z5GVP7', 'QTN', 'sldZ6xPLVMHf1HfhMTW1', 'beTbLaY3J5iLyA2H3GeR', 100, 0, NULL, N'TSS trong vùng an toàn', N'TSS trong vùng cảnh báo'),
  ('jRCTzI7dMuwED3q26dnA', 'QTN', 'bKQCfwFLq7SZ1U8iX0iC', 'cNH7rGlPAQzEVsdLaopE', 150, 50, NULL, N'COD trong vùng an toàn', N'COD trong vùng cảnh báo'),
  ('kxesOs5MfjDtwuNftQVu', 'QTN', 'J0ZJ4wGE1K9b1yWPA1AA', 'cNH7rGlPAQzEVsdLaopE', 2, 20, NULL, N'DO trong vùng an toàn', N'DO trong vùng cảnh báo'),
  ('MwaU4znVlSPJR1gRTRJG', 'QTN', 'bKQCfwFLq7SZ1U8iX0iC', 'XTuSjubAZ2OZPiZg4zpc', 50, 0, NULL, N'COD trong vùng an toàn', N'COD trong vùng cảnh báo'),
  ('PgUjFifPJwAhs6H9p9aE', 'QTN', 'QTwS5uidRRmwlsPmS11g', 'beTbLaY3J5iLyA2H3GeR', 9, 5.5, NULL, N'PH trong vùng an toàn', N'PH trong vùng cảnh báo'),
  ('rVdN6BNhtkj1d5FmtpVV', 'QTN', '1VShp3DqGd9NSLLbavBK', 'beTbLaY3J5iLyA2H3GeR', 35, 20, NULL, N'Nhiệt độ trong vùng an toàn', N'Nhiệt độ trong vùng cảnh báo'),
  ('rVo7cYvGO1ljkoCnz5tF', 'QTN', 'bKQCfwFLq7SZ1U8iX0iC', 'beTbLaY3J5iLyA2H3GeR', 50, 0, NULL, N'COD trong vùng an toàn', N'COD trong vùng cảnh báo'),
  ('sO4zKad5MXk9XiFKirpn', 'QTN', 'J0ZJ4wGE1K9b1yWPA1AA', 'XTuSjubAZ2OZPiZg4zpc', 2, 0, NULL, N'DO trong vùng an toàn', N'DO trong vùng cảnh báo'),
  ('uibBg0ZETrjXxvMILGq0', 'QTN', '1VShp3DqGd9NSLLbavBK', 'cNH7rGlPAQzEVsdLaopE', 35, 30, NULL, N'Nhiệt độ trong vùng an toàn', N'Nhiệt độ trong vùng cảnh báo'),
  ('YPgdx9lh3WuypDMdq4vr', 'QTK', '56GgjhXp43IIxoRFc7Yl', 'iCXwberyd08CDMLPEPtI', 30000, 0, NULL, N'Hướng gió vùng an toàn', N'Hướng gió vùng cảnh báo'),
  ('60x1Bn4ZaxBsMXuPKVJl', 'QTK', '0cxS4VcRuaS17F7vhN0D', '96uhrqbLC02Q9tjMwPbH', 40, 20, NULL, N'Nhiệt độ vùng an toàn', N'Nhiệt độ vùng cảnh báo'),
  ('71Rxs4QALH3qOBAAM6Kg', 'QTN', 'sldZ6xPLVMHf1HfhMTW1', 'cNH7rGlPAQzEVsdLaopE', 100, 0, NULL, N'TSS trong vùng an toàn', N'TSS trong vùng cảnh báo'),
  ('BKE734wFOq98x1zoUVTN', 'QTN', 'wpMTAZLKUmYHFbZ6oRwy', 'XTuSjubAZ2OZPiZg4zpc', 3, 0, NULL, N'NH4+N trong vùng an toàn', N'NH4+N trong vùng cảnh báo'),
  ('8zaGv3SvhiU5VC4aecye', 'QTN', 'wpMTAZLKUmYHFbZ6oRwy', 'cNH7rGlPAQzEVsdLaopE', 3, 0, NULL, N'NH4+N trong vùng an toàn', N'NH4+N trong vùng cảnh báo'),
  ('d3VlmRapsh4Fx3O1raIm', 'QTN', 'QTwS5uidRRmwlsPmS11g', 'XTuSjubAZ2OZPiZg4zpc', 9, 5.5, NULL, N'PH trong vùng an toàn', N'PH trong vùng cảnh báo');




INSERT INTO roles VALUES
('b4zW8q0XnQPDfmpoDOy2', 'god', 'God', 'view_latest_data_page, view_camera_streaming,view_table_data_page, check_data, view_chart_data_page, view_map_station_page, view_sation_info_page, view_station_config_page, create_new_station, delete_station, update_info_station, sample_water, general_report, detail_report, view_monitoring_group_page, create_monitoring_group, update_monitoring_group, delete_monitoring_group, view_indicator_page, create_indicator, delete_indicator, update_indicator, view_threshold_page, create_threshold, delete_threshold, update_threshold, view_user_page, create_user, delete_user, update_user, view_system_page, update_system, view_testdata_page, view_firmware_page, create_firmware, delete_firmware, update_firmware',1, null),
('wuuS2BE7gV5BDhwIL7Em', 'admin', 'Admin', 'view_latest_data_page, view_camera_streaming,view_table_data_page, check_data, view_chart_data_page, view_map_station_page, view_sation_info_page, view_station_config_page, create_new_station, delete_station, update_info_station, sample_water, general_report, detail_report, view_monitoring_group_page, create_monitoring_group, update_monitoring_group, delete_monitoring_group, view_indicator_page, create_indicator, delete_indicator, update_indicator, view_threshold_page, create_threshold, delete_threshold, update_threshold, view_user_page, create_user, delete_user, update_user, view_system_page, update_system, view_testdata_page, view_firmware_page, create_firmware, delete_firmware, update_firmware',2, null),
('5VqPomXM73PWqYKXzYwk', 'station_supervisor', N'Giám sát trạm', 'view_latest_data_page, view_camera_streaming, view_table_data_page, check_data, view_chart_data_page, view_map_station_page, view_sation_info_page, update_info_station, sample_water, detail_report',3, null),
('dug161VWGgQYiWseEqBu', 'normal_user', 'User', 'view_latest_data_page, view_table_data_page, view_chart_data_page, view_map_station_page, view_sation_info_page',4, null);


INSERT INTO users VALUES ('eYalbMK7hA9LuufWeLcK', N'Bạch Quốc Việt', 'vietbq@centic.vn', '$2b$10$3ZGZVyAfE2biRuFXaloiF.s4rCeXGFX3zz6cUtguGXvxfNgAORb8O', null, null, '0968405800', 'Trung tâm vi mạch Đà Nẵng - CENTIC', '15 Quang Trung Hải Châu Đà Nẵng', 1, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO user_role VALUES ('GgAx8QoVQt5TBF9cS5AK', 'eYalbMK7hA9LuufWeLcK', 'b4zW8q0XnQPDfmpoDOy2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO user_access_tokens VALUES ('lGVrWRmo2S9FvWNKS2KzqWUgpMdUBkOU7XRucUd4', 'eYalbMK7hA9LuufWeLcK', null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users VALUES ('hlWl0fKzSMAQTyKXsRM5', N'Đỗ Hữu Tín', 'tindh@centic.vn', '$2b$10$oC4H4EcytzlGX4sk.nuBsOu940IraiPQL8GRLGPDEb7ht8Q1lbHba', null, null, '0123456789', 'Trung tâm vi mạch Đà Nẵng - CENTIC', '15 Quang Trung Hải Châu Đà Nẵng', 1, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO user_role VALUES ('M4cReEdksbmvZVEpgILy', 'hlWl0fKzSMAQTyKXsRM5', 'b4zW8q0XnQPDfmpoDOy2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO user_access_tokens VALUES ('RSYU0E4hBk8Z3LSOqYS1QC1y1Ls4oitANQLPW0p8', 'hlWl0fKzSMAQTyKXsRM5', null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'1', N'1', N'smsAlertThreshold', N'TTQTMT thong bao: Tram $TENTRAM co chi so $SENSORS vuot nguong an toan. De nghi a/c phu trach tram kiem tra lai. Tran trong!')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'10', N'1', N'emailAlertStructure', N'<p>Kính gửi anh(chị) phụ trách theo dõi $TENTRAM!<p>
</br>
<p>$TRUNGTAM gửi email cảnh báo dữ liệu gửi về không đúng cấu trúc.Cụ thể:</p>
</br>
<p>- Tên trạm: $TENTRAM</p>
<p>- Ký hiệu trạm: $KYHIEUTRAM</p>
<p>- Lỗi quan trắc: $NHOMQUANTRAC</p>
<p>- Lỗi: File ftp gửi về không đúng cấu trúc</p>
</br>
<p>Đề nghị anh(chị) theo dõi và rà soát lỗi dữ liệu gửi về của trạm $TENTRAM</p>
</br>
<p>Trân trọng,</p>
<p>$TRUNGTAM</p>')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'11', N'1', N'titleEmailAlertBattery', N'Cảnh báo file truyền về không đúng cấu trúc')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'12', N'1', N'emailAlertBattery', NULL)
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'13', N'1', N'numberOfAlertSms', N'5')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'14', N'1', N'numberOfAlertEmail', N'5')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'15', N'1', N'alertSmsStatus', N'0')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'16', N'1', N'alertEmailStatus', N'0')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'17', N'1', N'paramThresholdFirstlevel', N'5')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'18', N'1', N'paramThresholdSecondlevel', N'10')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'19', N'1', N'paramDisconnectionFirstlevel', N'60')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'2', N'1', N'smsAlertDisconnection', N'TTQTMT thong bao: Tram $TENTRAM khong truyen du lieu ve trung tam. De nghi a/c phu trach $TENTRAM kiem tra lai. Tran trong!')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'20', N'1', N'paramDisconnectionSecondlevel', N'120')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'21', N'1', N'alertStructureStatus', N'1')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'22', N'1', N'ftpserverStnmt', NULL)
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'23', N'1', N'ftpusernameStnmt', NULL)
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'24', N'1', N'ftppasswordStnmt', NULL)
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'25', N'1', N'ftpserverBtnmt', NULL)
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'26', N'1', N'ftpusernameBtnmt', NULL)
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'27', N'1', N'dirReceiveFtp', N'/ArriveFiles')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'28', N'1', N'dirSaveFtp', N'/DataFiles')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'29', N'1', N'dirWrongFtp', N'/ErrorFiles')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'3', N'1', N'smsAlertStructure', N'TTQTMT thong bao: Tram $TENTRAM gui file du lieu khong dung cau truc. De nghi a/c phu trach $TENTRAM kiem tra lai. Tran trong!')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'30', N'1', N'upperThresholdColor', N'red')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'31', N'1', N'lowerThresholdColor', N'red')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'32', N'1', N'warningThresholdColor', N'red')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'33', N'1', N'safetyThresholdColor', N'green')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'34', N'1', N'mailServer', 'huutin25021993@gmail.com')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'35', N'1', N'mailPassword', NULL)
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'36', N'1', N'mailServername', N'Trung tâm Quan trắc Môi trường')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'37', N'1', N'mailClientId', N'590257600088-se1msnnvb9jd57nv3b8322f1mv1dm36r.apps.googleusercontent.com')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'38', N'1', N'mailClientSecret', N'ZELxuqPeJfL8MkEt9OLbz21h')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'39', N'1', N'mailRefreshToken', N'1/EmmooZsWXI4mFEgbbGuUgUryTFnDMeu-bLsXP_Co5D8')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'4', N'1', N'smsAlertBattery', NULL)
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'40', N'1', N'mailAccessToken', N'ya29.GltrBxFxaGeWny8Xso2cXpTCuYTOSOniIe73I6UVrxm5YqomyYfSYuuEoLSTP6FiDG8TyPwn_fHz2My-AUPki0zXuwL0BqhtG65DRmMPssxyogARqDn2xhN1QbuL')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'41', N'1', N'smsServer', N'http://49.156.52.24:5993/SmsService.asmx')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'42', N'1', N'smsUsername', N'centic')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'43', N'1', N'smsPassword', N'oipd645xlcj7va5')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'5', N'1', N'titleEmailAlertThreshold', N'Cảnh báo quan trắc vượt ngưỡng')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'6', N'1', N'emailAlertThreshold', N'<p>Kính gửi anh(chị) phụ trách theo dõi $TENTRAM!<p>
</br>
<p>$TRUNGTAM gửi email cảnh báo vượt ngưỡng quan trắc môi trường.Cụ thể:</p>
</br>
<p>- Tên trạm: $TENTRAM</p>
<p>- Ký hiệu trạm: $KYHIEUTRAM</p>
<p>- Loại quan trắc: $NHOMQUANTRAC</p>
<p>- Chỉ số vượt ngưỡng: $SENSORS</p>
<p>- Thời gian đo: $THOIGIANDO</p>
</br>
<p>Đề nghị anh(chị) theo dõi và xử lý vượt ngưỡng tại trạm $TENTRAM</p>
</br>
<p>Trân trọng,</p> 
<p>$TRUNGTAM</p>')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'7', N'1', N'titleEmailAlertDisconnection', N'Cảnh báo Trạm không truyền số liệu')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'8', N'1', N'emailAlertDisconnection', N'<p>Kính gửi anh(chị) phụ trách theo dõi $TENTRAM!<p>
</br>
<p>$TRUNGTAM gửi email cảnh báo Trạm không truyền dữ liệu.Cụ thể:</p>
</br>
<p>- Tên trạm: $TENTRAM</p>
<p>- Ký hiệu trạm: $KYHIEUTRAM</p>
<p>- Lỗi quan trắc: $NHOMQUANTRAC</p>
<p>- Lỗi: Trạm không truyền dữ liệu về</p>
</br>
<p>Đề nghị anh(chị) theo dõi và rà soát lại dữ liệu gửi về của trạm $TENTRAM</p>
</br>
<p>Trân trọng,</p>
<p>$TRUNGTAM</p>')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'9', N'1', N'titleEmailAlertStructure', N'Cảnh báo file truyền về không đúng cấu trúc')

  INSERT INTO stations VALUES 
  ('60x1Bn4ZaxBsMXuPKVJl', 'QTN', N'Hồ Bầu Tràm','cNH7rGlPAQzEVsdLaopE', 'NUOHBT', N'Liên Chiểu, Đà Nẵng', '0773498693', 'akhdf', NULL, NULL, 1, NULL, NULL, NULL, NULL,NULL, NULL,NULL, NULL,NULL, NULL,NULL, NULL,NULL, NULL,NULL, NULL,NULL, NULL,NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL );