INSERT INTO monitoring_types
VALUES
  ('QTN', N'Quan trắc nước', 'QTN', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('QTK', N'Quan trắc không khí', 'QTK', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO monitoring_groups
VALUES
  ('96uhrqbLC02Q9tjMwPbH', N'Quan trắc khí thải', 'QTK', 'QTKT', N'Quan trắc khí thải tại các khu công nghiệp', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('beTbLaY3J5iLyA2H3GeR', N'Quan trắc nước sinh hoạt', 'QTN', 'QTNSH', N'Quan trắc nước sinh hoạt trong hộ gia đình', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cNH7rGlPAQzEVsdLaopE', N'Quan trắc nước mặt', 'QTN', 'QTNM', N'Quan trắc nước mặt, sông suối, ao hồ', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('iCXwberyd08CDMLPEPtI', N'Quan trắc khí xung quanh', 'QTK', 'QTKXQ', N'Quan trắc khí xung quanh đô thị, đường phố	', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('XTuSjubAZ2OZPiZg4zpc', N'Quan trắc nước thải', 'QTN', 'QTNT', N'Quan trắc nước thải', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO indicators VALUES 
('0cxS4VcRuaS17F7vhN0D',	'TMP',	'QTK',	'TMP', 	'oC', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),	
('1VShp3DqGd9NSLLbavBK',	'TMP',	'QTN',	'TMP',	'oC',	N'Nhiệt độ', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('56GgjhXp43IIxoRFc7Yl',	'Hướng gió',	'QTK',	'WD',	'Deg',	N'Hướng gió', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bKQCfwFLq7SZ1U8iX0iC',	'COD', 	'QTN',	'COD',	'mg/l',	N'Nồng độ COD', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cLEtKPGFPGXWiyn0wAiA',	'PM2.5',	'QTK',	'PM25',	'PPM', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),	
('emyzT0NiSVNQRnJzbDBC',	'Ozon',	'QTK',	'O3',	'PPM', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('fI8Dfk3eN0eEOQ6nz3Di',	'SO2',	'QTK',	'SO2',	'PPM',	'SO2', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('HMdhlulrYzviyeAmSevW',	'NO2',	'QTK',	'NO2',	'PPM',	'NO2', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('HZRtXK5QYiUGjgO7NRZy',	N'Tốc độ gió giật',	'QTK',	'WSG',	'kph',	N'Tốc độ gió giật', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('i26vWIyFl05Ecujsn5BR',	'PM10',	'QTK',	'PM10',	'PPM', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),	
('J0ZJ4wGE1K9b1yWPA1AA',	'DO',	'QTN',	'DO',	'mg/l',	N'Nồng độ DO', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Lfbfh2vAUjNAcvki3JP5',	N'Tốc độ gió',	'QTK',	'WS',	'kph',	N'Tốc độ gió', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('LgVUIVDaFcbrqPBn44vc',	N'Áp suất',	'QTK',	'PRESS',	'PA',	N'Áp suất', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('LO27zW7EG51OT0NvioAM',	N'Độ ẩm',	'QTK',	'HUMI',	'%', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),	
('lygl115ZhbwHtFFcfZ1o',	'PM4.0',	'QTK',	'PM4',	'PPM', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP	),
('m9Bgth2ILQle2nJo5Qzi',	'CO',	'QTK',	'CO',	'PPM', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),	
('QTwS5uidRRmwlsPmS11g',	'PH',	'QTN',	'PH',	'Nồng độ', 'PH', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sldZ6xPLVMHf1HfhMTW1',	'TSS',	'QTN',	'TSS',	'mg/l',	N'Nồng độ TSS', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('vEqph5mgGSxZDt3tVIR8',	'PM1.0',	'QTK',	'PM1',	'PPM', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),	
('wpMTAZLKUmYHFbZ6oRwy',	'NH4+N',	'QTN',	'NH4',	'mg/l',	N'Nồng độ amoniac trong nước', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Yb7XPS06OCKwqIPa9waw',	N'Hướng gió giật',	'QTK',	'WDG', 	'Deg',	N'Hướng gió giật', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO indicator_threshold
VALUES
  ('3xKWkUUARmwnO41tfPoo', 'QTK', 'Lfbfh2vAUjNAcvki3JP5', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('5eUmTnzcrluFwkwQSVV7', 'QTK', 'lygl115ZhbwHtFFcfZ1o', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ,
  ('5u4DxrnzIM4BItmls5Wv', 'QTK', 'vEqph5mgGSxZDt3tVIR8', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('882WqL4KFrqNYlVEqLVn', 'QTK', 'LgVUIVDaFcbrqPBn44vc', '96uhrqbLC02Q9tjMwPbH', 300000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('a4hfyus1e4GXirP3bWZG', 'QTK', 'cLEtKPGFPGXWiyn0wAiA', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('BFOnUnuhJz3evxksQ9Ya', 'QTK', 'LgVUIVDaFcbrqPBn44vc', 'iCXwberyd08CDMLPEPtI', 300000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('BoY1nfMTc5o1J4WnELyC', 'QTK', 'HMdhlulrYzviyeAmSevW', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('bwUgYCHaTPg0qPvKW7zT', 'QTK', 'Yb7XPS06OCKwqIPa9waw', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('CkUyv12M0vPKhTHky0Qh', 'QTK', 'LO27zW7EG51OT0NvioAM', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d3zPRPOo9YuoGKO9PHIz', 'QTK', 'emyzT0NiSVNQRnJzbDBC', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('DSMoqbqkHOOUbghdWBE8', 'QTK', 'vEqph5mgGSxZDt3tVIR8', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ebjnNYLTdDgAcIUxslgu', 'QTK', 'fI8Dfk3eN0eEOQ6nz3Di', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Es0UdaZoJpbYQsB5gQR1', 'QTK', 'fI8Dfk3eN0eEOQ6nz3Di', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('g1WxMgLPH0UPctwX0j2y', 'QTK', 'HMdhlulrYzviyeAmSevW', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('k51X5UV1PskypXqLq2jo', 'QTK', 'cLEtKPGFPGXWiyn0wAiA', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('LBlvVz3ugkyu1KmvROZx', 'QTK', 'i26vWIyFl05Ecujsn5BR', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mHKierSOt5dvilpZItaN', 'QTK', 'Yb7XPS06OCKwqIPa9waw', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('OJULocC23A0sVI3ioROU', 'QTK', 'Lfbfh2vAUjNAcvki3JP5', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pT47yxXMIQMYt53OmcmB', 'QTK', 'm9Bgth2ILQle2nJo5Qzi', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('QJ9SgZnHZWvYhjdkevBD', 'QTK', 'lygl115ZhbwHtFFcfZ1o', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('qlSehcZHsCCL27WbATAT', 'QTK', 'emyzT0NiSVNQRnJzbDBC', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('SG0tTSOVJ0dYMi0fLC1i', 'QTK', 'i26vWIyFl05Ecujsn5BR', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sKhV1Mtc25kif7Hv9OyI', 'QTK', 'LO27zW7EG51OT0NvioAM', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vA31D9eeGP4GCiMX6MwO', 'QTK', 'm9Bgth2ILQle2nJo5Qzi', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vxfOJPLMDQYDNNNIMyEV', 'QTK', 'HZRtXK5QYiUGjgO7NRZy', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('XiGo3KvIZNe995b5lNTZ', 'QTK', 'HZRtXK5QYiUGjgO7NRZy', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('DK79An7cvaER6qEicvYh', 'QTK', '56GgjhXp43IIxoRFc7Yl', '96uhrqbLC02Q9tjMwPbH', 30000, 0, N'Hướng gió vùng an toàn', N'Hướng gió vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('epqOAYx8tspuyveKApdi', 'QTN', 'wpMTAZLKUmYHFbZ6oRwy', 'beTbLaY3J5iLyA2H3GeR', 3, 0, N'NH4+N trong vùng an toàn', N'NH4+N trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('eq7ULhnVqknZ0FsgHXJd', 'QTK', '0cxS4VcRuaS17F7vhN0D', 'iCXwberyd08CDMLPEPtI', 40, 20, N'Nhiệt độ vùng an toàn', N'Nhiệt độ vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Ex2FI6yfdFHFbTbkPwm8', 'QTN', 'sldZ6xPLVMHf1HfhMTW1', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, N'TSS trong vùng an toàn', N'TSS trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hFEgsauqqpVAhfyRIl5c', 'QTN', 'QTwS5uidRRmwlsPmS11g', 'cNH7rGlPAQzEVsdLaopE', 9, 5.5, N'PH trong vùng an toàn', N'PH trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hYQoox1Wyr70vNh5EvxE', 'QTN', 'J0ZJ4wGE1K9b1yWPA1AA', 'beTbLaY3J5iLyA2H3GeR', 2, 0, N'DO trong vùng an toàn', N'DO trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('I6251N3ciSPfiV9HoeXg', 'QTN', '1VShp3DqGd9NSLLbavBK', 'XTuSjubAZ2OZPiZg4zpc', 35, 20, N'Nhiệt độ trong vùng an toàn', N'Nhiệt độ trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('jAMLfYMbBqkTP3z5GVP7', 'QTN', 'sldZ6xPLVMHf1HfhMTW1', 'beTbLaY3J5iLyA2H3GeR', 100, 0, N'TSS trong vùng an toàn', N'TSS trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('jRCTzI7dMuwED3q26dnA', 'QTN', 'bKQCfwFLq7SZ1U8iX0iC', 'cNH7rGlPAQzEVsdLaopE', 150, 50, N'COD trong vùng an toàn', N'COD trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('kxesOs5MfjDtwuNftQVu', 'QTN', 'J0ZJ4wGE1K9b1yWPA1AA', 'cNH7rGlPAQzEVsdLaopE', 2, 20, N'DO trong vùng an toàn', N'DO trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('MwaU4znVlSPJR1gRTRJG', 'QTN', 'bKQCfwFLq7SZ1U8iX0iC', 'XTuSjubAZ2OZPiZg4zpc', 50, 0, N'COD trong vùng an toàn', N'COD trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('PgUjFifPJwAhs6H9p9aE', 'QTN', 'QTwS5uidRRmwlsPmS11g', 'beTbLaY3J5iLyA2H3GeR', 9, 5.5, N'PH trong vùng an toàn', N'PH trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('rVdN6BNhtkj1d5FmtpVV', 'QTN', '1VShp3DqGd9NSLLbavBK', 'beTbLaY3J5iLyA2H3GeR', 35, 20, N'Nhiệt độ trong vùng an toàn', N'Nhiệt độ trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('rVo7cYvGO1ljkoCnz5tF', 'QTN', 'bKQCfwFLq7SZ1U8iX0iC', 'beTbLaY3J5iLyA2H3GeR', 50, 0, N'COD trong vùng an toàn', N'COD trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sO4zKad5MXk9XiFKirpn', 'QTN', 'J0ZJ4wGE1K9b1yWPA1AA', 'XTuSjubAZ2OZPiZg4zpc', 2, 0, N'DO trong vùng an toàn', N'DO trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('uibBg0ZETrjXxvMILGq0', 'QTN', '1VShp3DqGd9NSLLbavBK', 'cNH7rGlPAQzEVsdLaopE', 35, 30, N'Nhiệt độ trong vùng an toàn', N'Nhiệt độ trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('YPgdx9lh3WuypDMdq4vr', 'QTK', '56GgjhXp43IIxoRFc7Yl', 'iCXwberyd08CDMLPEPtI', 30000, 0, N'Hướng gió vùng an toàn', N'Hướng gió vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('60x1Bn4ZaxBsMXuPKVJl', 'QTK', '0cxS4VcRuaS17F7vhN0D', '96uhrqbLC02Q9tjMwPbH', 40, 20, N'Nhiệt độ vùng an toàn', N'Nhiệt độ vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('71Rxs4QALH3qOBAAM6Kg', 'QTN', 'sldZ6xPLVMHf1HfhMTW1', 'cNH7rGlPAQzEVsdLaopE', 100, 0, N'TSS trong vùng an toàn', N'TSS trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('BKE734wFOq98x1zoUVTN', 'QTN', 'wpMTAZLKUmYHFbZ6oRwy', 'XTuSjubAZ2OZPiZg4zpc', 3, 0, N'NH4+N trong vùng an toàn', N'NH4+N trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('8zaGv3SvhiU5VC4aecye', 'QTN', 'wpMTAZLKUmYHFbZ6oRwy', 'cNH7rGlPAQzEVsdLaopE', 3, 0, N'NH4+N trong vùng an toàn', N'NH4+N trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d3VlmRapsh4Fx3O1raIm', 'QTN', 'QTwS5uidRRmwlsPmS11g', 'XTuSjubAZ2OZPiZg4zpc', 9, 5.5, N'PH trong vùng an toàn', N'PH trong vùng cảnh báo', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

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
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'22', N'1', N'ftpserverStnmt', N'')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'23', N'1', N'ftpusernameStnmt', N'')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'24', N'1', N'ftppasswordStnmt', N'')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'25', N'1', N'ftpserverBtnmt', N'192.168.1.23')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'26', N'1', N'ftpusernameBtnmt', N'')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'27', N'1', N'dirReceiveFtp', N'/ArriveFiles')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'28', N'1', N'dirSaveFtp', N'/DataFiles')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'29', N'1', N'dirWrongFtp', N'/ErrorFiles')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'3', N'1', N'smsAlertStructure', N'TTQTMT thong bao: Tram $TENTRAM gui file du lieu khong dung cau truc. De nghi a/c phu trach $TENTRAM kiem tra lai. Tran trong!')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'30', N'1', N'upperThresholdColor', N'red')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'31', N'1', N'lowerThresholdColor', N'red')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'32', N'1', N'warningThresholdColor', N'red')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'33', N'1', N'safetyThresholdColor', N'green')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'34', N'1', N'mailServer', N'huutin25021993@gmail.com')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'35', N'1', N'mailPassword', N'')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'36', N'1', N'mailServername', N'Trung tâm Quan trắc Môi trường')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'37', N'1', N'mailClientId', N'590257600088-se1msnnvb9jd57nv3b8322f1mv1dm36r.apps.googleusercontent.com')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'38', N'1', N'mailClientSecret', N'ZELxuqPeJfL8MkEt9OLbz21h')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'39', N'1', N'mailRefreshToken', N'1/EmmooZsWXI4mFEgbbGuUgUryTFnDMeu-bLsXP_Co5D8')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'4', N'1', N'smsAlertBattery', NULL)
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'40', N'1', N'mailAccessToken', N'ya29.GltrBxFxaGeWny8Xso2cXpTCuYTOSOniIe73I6UVrxm5YqomyYfSYuuEoLSTP6FiDG8TyPwn_fHz2My-AUPki0zXuwL0BqhtG65DRmMPssxyogARqDn2xhN1QbuL')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'41', N'1', N'smsServer', N'http://49.156.52.24:5993/SmsService.asmx')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'42', N'1', N'smsUsername', N'centic')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'43', N'1', N'smsPassword', N'oipd645xlcj7va5')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'44', N'1', N'ftpportStnmt', N'')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'45', N'1', N'ftpusernameBtnmt', N'')
INSERT [dbo].[systems] ([id], [idSystem], [name], [value]) VALUES (N'46', N'1', N'ftpportBtnmt', N'')
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

INSERT [dbo].[roles] ([id], [name], [displayName], [permissions], [priority], [description]) VALUES (N'5VqPomXM73PWqYKXzYwk', N'station_supervisor', N'Giám sát trạm', N'view_latest_data_page, view_camera_streaming, view_table_data_page, check_data, view_chart_data_page, view_map_station_page, view_sation_info_page, update_info_station, sample_water, detail_report', 3, NULL)
INSERT [dbo].[roles] ([id], [name], [displayName], [permissions], [priority], [description]) VALUES (N'b4zW8q0XnQPDfmpoDOy2', N'god', N'God', N'view_latest_data_page, view_camera_streaming,view_table_data_page, check_data, view_chart_data_page, view_map_station_page, view_sation_info_page, view_station_config_page, create_new_station, delete_station, update_info_station, sample_water, general_report, detail_report, view_monitoring_group_page, create_monitoring_group, update_monitoring_group, delete_monitoring_group, view_indicator_page, create_indicator, delete_indicator, update_indicator, view_threshold_page, create_threshold, delete_threshold, update_threshold, view_user_page, create_user, delete_user, update_user, view_system_page, update_system, view_testdata_page, view_firmware_page, create_firmware, delete_firmware, update_firmware', 1, NULL)
INSERT [dbo].[roles] ([id], [name], [displayName], [permissions], [priority], [description]) VALUES (N'dug161VWGgQYiWseEqBu', N'normal_user', N'User', N'view_latest_data_page, view_table_data_page, view_chart_data_page, view_map_station_page, view_sation_info_page', 4, NULL)
INSERT [dbo].[roles] ([id], [name], [displayName], [permissions], [priority], [description]) VALUES (N'wuuS2BE7gV5BDhwIL7Em', N'admin', N'Admin', N'view_latest_data_page, view_camera_streaming,view_table_data_page, check_data, view_chart_data_page, view_map_station_page, view_sation_info_page, view_station_config_page, create_new_station, delete_station, update_info_station, sample_water, general_report, detail_report, view_monitoring_group_page, create_monitoring_group, update_monitoring_group, delete_monitoring_group, view_indicator_page, create_indicator, delete_indicator, update_indicator, view_threshold_page, create_threshold, delete_threshold, update_threshold, view_user_page, create_user, delete_user, update_user, view_system_page, update_system, view_testdata_page, view_firmware_page, create_firmware, delete_firmware, update_firmware', 2, NULL)

INSERT [dbo].[stations] ([id], [monitoringType], [name], [monitoringGroupId], [symbol], [address], [phone], [image], [rootLocation], [lastedLocation], [updateLocationStatus], [installedAt], [verifiedAt], [verificationOrganization], [emittedFrequency], [ftpFolder], [ftpFilename], [latestSentAt], [sendftpStatus], [receiveftpStatus], [lastedIndicatorOverThreshold], [numberOfThreshold], [numberOfAlertThreshold], [alertThresholdStatus], [numberOfAlertStructure], [alertStructureStatus], [numberOfDisconnection], [alertDisconnectionStatus], [battery], [activityStatus], [publicStatus],[disconnectionTime],[deletedAt], [createdAt], [updatedAt]) VALUES (N'18lc1CrzUlVCD3opI2qN', N'QTN', N'Hồ Thạc Gián', N'XTuSjubAZ2OZPiZg4zpc', N'NUOHTG', N'Thanh Khuê, Đà Nẵng', N'0773498693', N'FhbwcMQ69jffRXYRYtCB-TramNuoc3.jpg', N'16.063839, 108.209890', NULL, 1, CAST(N'2019-12-17T17:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2019-12-26T17:00:00.0000000+00:00' AS DateTimeOffset), N'Trung tâm Kĩ thuật Tiêu chuẩn Đo lường Chất lượng 2 (QUATEST2)', 10, N'NUOTHACGIAN', N'DNa_CENT_NUOHTTG_yyyyMMddhhmmss.txt', CAST(N'2020-01-03T03:00:00.0000000+00:00' AS DateTimeOffset), 1, 1, NULL, 18, 0, 1, 1, 1, 5, 1, NULL, 1, 1, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

INSERT [dbo].[stations] ([id], [monitoringType], [name], [monitoringGroupId], [symbol], [address], [phone], [image], [rootLocation], [lastedLocation], [updateLocationStatus], [installedAt], [verifiedAt], [verificationOrganization], [emittedFrequency], [ftpFolder], [ftpFilename], [latestSentAt], [sendftpStatus], [receiveftpStatus], [lastedIndicatorOverThreshold], [numberOfThreshold], [numberOfAlertThreshold], [alertThresholdStatus], [numberOfAlertStructure], [alertStructureStatus], [numberOfDisconnection], [alertDisconnectionStatus], [battery], [activityStatus], [publicStatus],[disconnectionTime],[deletedAt], [createdAt], [updatedAt]) VALUES (N'1WMKmxYkgNpbLzolqjiJ', N'QTN', N'Trạm Công Viên 29/3', N'cNH7rGlPAQzEVsdLaopE', N'NUOCV', N'Hải Châu, Đà Nẵng', N'09871623614', N'kKNIaaLXqkhZjXsAY05G-TramNuoc1.JPG', N'16.063752, 108.205004', NULL, 1, CAST(N'2019-12-24T17:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2019-12-24T17:00:00.0000000+00:00' AS DateTimeOffset), N'Trung tâm Kĩ thuật Tiêu chuẩn Đo lường Chất lượng 2 (QUATEST2)', 5, N'NUOCONGVIEN', N'DNa_CENT_NUOCV_yyyyMMddhhmmss.txt', CAST(N'2020-01-04T07:32:01.0000000+00:00' AS DateTimeOffset), 1, 1, NULL, 515, 1, 1, 0, 1, 5, 1, NULL, 1, 1, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

INSERT [dbo].[stations] ([id], [monitoringType], [name], [monitoringGroupId], [symbol], [address], [phone], [image], [rootLocation], [lastedLocation], [updateLocationStatus], [installedAt], [verifiedAt], [verificationOrganization], [emittedFrequency], [ftpFolder], [ftpFilename], [latestSentAt], [sendftpStatus], [receiveftpStatus], [lastedIndicatorOverThreshold], [numberOfThreshold], [numberOfAlertThreshold], [alertThresholdStatus], [numberOfAlertStructure], [alertStructureStatus], [numberOfDisconnection], [alertDisconnectionStatus], [battery], [activityStatus], [publicStatus],[disconnectionTime],[deletedAt], [createdAt], [updatedAt]) VALUES (N'fquFOTIuuM1LT2G3EzoX', N'QTN', N'Trạm Bầu Tràm', N'cNH7rGlPAQzEVsdLaopE', N'NUOBT', N'Liên Chiểu, Đà Nẵng', N'09871623612', N'i4uXuXAHKSYdXLnARrCm-TramNuoc5.JPG', N'16.090642, 108.137516', NULL, 1, CAST(N'2019-12-24T17:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2019-12-24T17:00:00.0000000+00:00' AS DateTimeOffset), N'Trung tâm Kĩ thuật Tiêu chuẩn Đo lường Chất lượng 2 (QUATEST2)', 5, N'NUOBAUTRAM', N'DNa_CENT_NUOHBT_yyyyMMddhhmmss.txt', CAST(N'2020-01-04T07:32:01.0000000+00:00' AS DateTimeOffset), 1, 1, NULL, 635, 2, 1, 0, 1, 5, 1, NULL, 1, 1, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
INSERT [dbo].[stations] ([id], [monitoringType], [name], [monitoringGroupId], [symbol], [address], [phone], [image], [rootLocation], [lastedLocation], [updateLocationStatus], [installedAt], [verifiedAt], [verificationOrganization], [emittedFrequency], [ftpFolder], [ftpFilename], [latestSentAt], [sendftpStatus], [receiveftpStatus], [lastedIndicatorOverThreshold], [numberOfThreshold], [numberOfAlertThreshold], [alertThresholdStatus], [numberOfAlertStructure], [alertStructureStatus], [numberOfDisconnection], [alertDisconnectionStatus], [battery], [activityStatus], [publicStatus],[disconnectionTime],[deletedAt], [createdAt], [updatedAt]) VALUES (N'GjobSYps65wJ0dZ9tQOK', N'QTN', N'Khu CN Hòa Khánh', N'XTuSjubAZ2OZPiZg4zpc', N'NTKCNHoaKhanh', N'Khu Công nghiệp Hòa Khánh, Đà Nẵng', N'08172617281', N'pISN3BD2IXf8rWKHUKAN-TramNuoc4.JPG', N'16.056781, 108.195379', NULL, 1, CAST(N'2016-09-05T17:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2016-11-13T17:00:00.0000000+00:00' AS DateTimeOffset), N'Trung tâm Kĩ thuật Tiêu chuẩn Đo lường Chất lượng 2 (QUATEST2)', 10, N'NTKCNHOAKHANH', N'NTKCNHOAKHANH_yyyyMMddhhmmss.txt', CAST(N'2016-12-14T03:30:00.0000000+00:00' AS DateTimeOffset), 1, 1, NULL, 0, 0, 1, 0, 1, 1, 1, NULL, 1, 1, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
INSERT [dbo].[stations] ([id], [monitoringType], [name], [monitoringGroupId], [symbol], [address], [phone], [image], [rootLocation], [lastedLocation], [updateLocationStatus], [installedAt], [verifiedAt], [verificationOrganization], [emittedFrequency], [ftpFolder], [ftpFilename], [latestSentAt], [sendftpStatus], [receiveftpStatus], [lastedIndicatorOverThreshold], [numberOfThreshold], [numberOfAlertThreshold], [alertThresholdStatus], [numberOfAlertStructure], [alertStructureStatus], [numberOfDisconnection], [alertDisconnectionStatus], [battery], [activityStatus], [publicStatus],[disconnectionTime],[deletedAt], [createdAt], [updatedAt]) VALUES (N'Nac7umkiUjt2PqnFARmm', N'QTN', N'Hồ Đò Xu', N'cNH7rGlPAQzEVsdLaopE', N'NUOHDX', N'Thôn Thái Lai, xã Hòa Nhơn', N'0122 349 8693', N'ZCcAUqKmxX22SU4exNDb-TramNuoc6.JPG', N'16.071781, 108.199379', NULL, 1, CAST(N'2019-12-17T17:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2019-12-24T17:00:00.0000000+00:00' AS DateTimeOffset), N'Trung tâm Kĩ thuật Tiêu chuẩn Đo lường Chất lượng 2 (QUATEST2)', 5, N'NUODOXU', N'DNa_CENT_NUODX_yyyyMMddhhmmss.txt', CAST(N'2020-01-04T07:32:01.0000000+00:00' AS DateTimeOffset), 1, 1, NULL, 515, 1, 1, 0, 1, 5, 1, NULL, 1, 1, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
INSERT [dbo].[stations] ([id], [monitoringType], [name], [monitoringGroupId], [symbol], [address], [phone], [image], [rootLocation], [lastedLocation], [updateLocationStatus], [installedAt], [verifiedAt], [verificationOrganization], [emittedFrequency], [ftpFolder], [ftpFilename], [latestSentAt], [sendftpStatus], [receiveftpStatus], [lastedIndicatorOverThreshold], [numberOfThreshold], [numberOfAlertThreshold], [alertThresholdStatus], [numberOfAlertStructure], [alertStructureStatus], [numberOfDisconnection], [alertDisconnectionStatus], [battery], [activityStatus], [publicStatus],[disconnectionTime],[deletedAt], [createdAt], [updatedAt]) VALUES (N'nwQr4uhKCEL2DWc86riZ', N'QTK', N'Trạm Điện Biên Phủ', N'iCXwberyd08CDMLPEPtI', N'KHIDBP', N'Điện Biên Phủ, Đà Nẵng', N'01928381721', N'BkbZgSDz2g9ELl9ygIEV-DE9179F8-7800-4640-903E-12FFF4107FCD.jpg', N'16.041781, 108.199379', NULL, 1, CAST(N'2019-12-24T17:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2019-12-24T17:00:00.0000000+00:00' AS DateTimeOffset), N'Trung tâm Kĩ thuật Tiêu chuẩn Đo lường Chất lượng 2 (QUATEST2)', 5, N'KHIDIENBIENPHU', N'DNa_CENT_KHIDBP_yyyyMMddhhmmss.txt', CAST(N'2020-01-04T07:32:01.0000000+00:00' AS DateTimeOffset), 1, 1, NULL, 0, 0, 1, 0, 1, 1, 1, NULL, 1, 1, 60,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
INSERT [dbo].[stations] ([id], [monitoringType], [name], [monitoringGroupId], [symbol], [address], [phone], [image], [rootLocation], [lastedLocation], [updateLocationStatus], [installedAt], [verifiedAt], [verificationOrganization], [emittedFrequency], [ftpFolder], [ftpFilename], [latestSentAt], [sendftpStatus], [receiveftpStatus], [lastedIndicatorOverThreshold], [numberOfThreshold], [numberOfAlertThreshold], [alertThresholdStatus], [numberOfAlertStructure], [alertStructureStatus], [numberOfDisconnection], [alertDisconnectionStatus], [battery], [activityStatus], [publicStatus],[disconnectionTime],[deletedAt], [createdAt], [updatedAt]) VALUES (N'RRGCIckiCQJYgLcvsrqx', N'QTK', N'Trạm Bạch Đằng', N'96uhrqbLC02Q9tjMwPbH', N'KHIBD', N'Hai Chau, Da Nang', N'9348372732', N'y5hNGVbtcJ8rRdVVUxht-tramtrungtamhanhchinh3.jpg', N'16.071781, 108.199379', NULL, 1, CAST(N'2019-12-25T17:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2019-12-25T17:00:00.0000000+00:00' AS DateTimeOffset), N'Trung tâm Kĩ thuật Tiêu chuẩn Đo lường Chất lượng 2 (QUATEST2)', 5, N'KHIBACHDANG', N'DNa_CENT_KHIBD_yyyyMMddhhmmss.txt', CAST(N'2020-01-04T07:32:01.0000000+00:00' AS DateTimeOffset), 1, 1, NULL, 0, 0, 1, 0, 1, 1, 1, NULL, 1, 1, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
INSERT [dbo].[stations] ([id], [monitoringType], [name], [monitoringGroupId], [symbol], [address], [phone], [image], [rootLocation], [lastedLocation], [updateLocationStatus], [installedAt], [verifiedAt], [verificationOrganization], [emittedFrequency], [ftpFolder], [ftpFilename], [latestSentAt], [sendftpStatus], [receiveftpStatus], [lastedIndicatorOverThreshold], [numberOfThreshold], [numberOfAlertThreshold], [alertThresholdStatus], [numberOfAlertStructure], [alertStructureStatus], [numberOfDisconnection], [alertDisconnectionStatus], [battery], [activityStatus], [publicStatus],[disconnectionTime],[deletedAt], [createdAt], [updatedAt]) VALUES (N'YbRNxIDqnvx2IOdonIdA', N'QTN', N'Kênh Phú Lộc', N'beTbLaY3J5iLyA2H3GeR', N'NUOKPL', N'Thanh Khuê, Đà Nẵng', N'847765746312', N'yu9nQ5eXXqk0IMKBZf6A-TramNuoc2.JPG', N'16.069234, 108.181638', NULL, 1, CAST(N'2019-12-17T17:00:00.0000000+00:00' AS DateTimeOffset), CAST(N'2019-12-26T17:00:00.0000000+00:00' AS DateTimeOffset), N'Trung tâm Kĩ thuật Tiêu chuẩn Đo lường Chất lượng 2 (QUATEST2)', 5, N'NUOPHULOC', N'DNa_CENT_NUOHPL_yyyyMMddhhmmss.txt', CAST(N'2020-01-04T07:32:01.0000000+00:00' AS DateTimeOffset), 1, 1, NULL, 1, 0, 1, 0, 1, 1, 1, NULL, 1, 1,60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

INSERT [dbo].[station_ftp] ([id], [stationId], [host], [username], [password], [port], [ftpFilename], [deletedAt], [createdAt], [updatedAt]) VALUES (N'YbRNxIDqnvx2IOdonIdA', N'YbRNxIDqnvx2IOdonIdA', '192.169.39.19', 'centic1', 'stnmt123', 21,N'DNa_CENT_NUOHPL_yyyyMMddhhmmss.txt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
INSERT [dbo].[station_ftp] ([id], [stationId], [host], [username], [password], [port], [ftpFilename], [deletedAt], [createdAt], [updatedAt]) VALUES (N'YbRNxIDqnvx2IOdonIdA', N'GjobSYps65wJ0dZ9tQOK', '192.169.39.19', 'centic2', 'stnmt123', 21,N'DNa_CENT_NUOHPL_yyyyMMddhhmmss.txt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
INSERT [dbo].[station_ftp] ([id], [stationId], [host], [username], [password], [port], [ftpFilename], [deletedAt], [createdAt], [updatedAt]) VALUES (N'YbRNxIDqnvx2IOdonIdA', N'nwQr4uhKCEL2DWc86riZ', '192.169.39.19', 'centic3', 'stnmt123', 21,N'DNa_CENT_NUOHPL_yyyyMMddhhmmss.txt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)


INSERT [dbo].[users] ([id], [name], [email], [password], [emailVerifiedAt], [alertEmail], [phoneNumber], [workplace], [address], [isActive], [deletedAt], [createdAt], [updatedAt]) VALUES (N'7zBT7sDLvwZYZT16nMex', N'Nguyễn Văn Toản', N'huutin25021993@gmail.com', N'5074275845', NULL, NULL, N'5074275845', N'Centic', N'Hòa Nhơn, Hòa Vang, Đà Nẵng', 1, NULL, CAST(N'2020-01-16T02:25:57.2280000+00:00' AS DateTimeOffset), CAST(N'2020-01-17T03:44:01.0440000+00:00' AS DateTimeOffset))
INSERT [dbo].[users] ([id], [name], [email], [password], [emailVerifiedAt], [alertEmail], [phoneNumber], [workplace], [address], [isActive], [deletedAt], [createdAt], [updatedAt]) VALUES (N'bKgUDqgSkd18DPsd5YuI', N'Việt Bạch', N'huutinece2502@gmail.com', N'$2b$10$byqePtJZk930yEi.O3u3MewG8QY2WjIi9kP5EabdmrXCN.6aMB1PW', NULL, NULL, N'0192837181', N'Centic', N'Thôn Thái Lai, xã Hòa Nhơn', 1, NULL, CAST(N'2020-01-17T09:46:09.6250000+00:00' AS DateTimeOffset), CAST(N'2020-01-17T09:46:09.6250000+00:00' AS DateTimeOffset))
INSERT [dbo].[users] ([id], [name], [email], [password], [emailVerifiedAt], [alertEmail], [phoneNumber], [workplace], [address], [isActive], [deletedAt], [createdAt], [updatedAt]) VALUES (N'eYalbMK7hA9LuufWeLcK', N'Bạch Quốc Việt', N'vietbq@centic.vn', N'$2b$10$3ZGZVyAfE2biRuFXaloiF.s4rCeXGFX3zz6cUtguGXvxfNgAORb8O', NULL, NULL, N'0968405800', N'Trung tâm vi m?ch Đà N?ng - CENTIC', N'15 Quang Trung H?i Châu Đà N?ng', 1, NULL, CAST(N'2019-12-25T11:38:35.1133333+00:00' AS DateTimeOffset), CAST(N'2019-12-25T11:38:35.1133333+00:00' AS DateTimeOffset))
INSERT [dbo].[users] ([id], [name], [email], [password], [emailVerifiedAt], [alertEmail], [phoneNumber], [workplace], [address], [isActive], [deletedAt], [createdAt], [updatedAt]) VALUES (N'hlWl0fKzSMAQTyKXsRM5', N'Đỗ Hữu Tín', N'tindh@centic.vn', N'$2b$10$oC4H4EcytzlGX4sk.nuBsOu940IraiPQL8GRLGPDEb7ht8Q1lbHba', NULL, NULL, N'0123456789', N'Trung tâm vi m?ch Đà N?ng - CENTIC', N'15 Quang Trung H?i Châu Đà N?ng', 1, NULL, CAST(N'2019-12-25T11:38:35.1200000+00:00' AS DateTimeOffset), CAST(N'2019-12-25T11:38:35.1200000+00:00' AS DateTimeOffset))
INSERT [dbo].[users] ([id], [name], [email], [password], [emailVerifiedAt], [alertEmail], [phoneNumber], [workplace], [address], [isActive], [deletedAt], [createdAt], [updatedAt]) VALUES (N'SDMuGZE8ZizIhWMJoyjQ', N'Nguyen Van B', N'41204486b3@gmail.com', N'0968405886', NULL, NULL, N'0968405886', N'CENTIC', N'15 Quang Trung', 1, NULL, CAST(N'2020-01-14T02:02:14.3180000+00:00' AS DateTimeOffset), CAST(N'2020-01-14T02:02:14.3180000+00:00' AS DateTimeOffset))

INSERT [dbo].[user_access_tokens] ([token], [userId], [description]) VALUES (N'0luo6JVBiAGxEoHpkBcisEygEZbUE5NdbKZIIydB', N'7zBT7sDLvwZYZT16nMex', NULL)
INSERT [dbo].[user_access_tokens] ([token], [userId], [description]) VALUES (N'kmu7fG1rY49VEE1MdmhVYrh9GLnNsLCmfTlMf0rC', N'SDMuGZE8ZizIhWMJoyjQ', NULL)
INSERT [dbo].[user_access_tokens] ([token], [userId], [description]) VALUES (N'lGVrWRmo2S9FvWNKS2KzqWUgpMdUBkOU7XRucUd4', N'eYalbMK7hA9LuufWeLcK', NULL)
INSERT [dbo].[user_access_tokens] ([token], [userId], [description]) VALUES (N'RSYU0E4hBk8Z3LSOqYS1QC1y1Ls4oitANQLPW0p8', N'hlWl0fKzSMAQTyKXsRM5', NULL)
INSERT [dbo].[user_access_tokens] ([token], [userId], [description]) VALUES (N'SEwzXrP1NPtjbWeYCGlLF4GZbGrTOtz7AJiTgxqv', N'bKgUDqgSkd18DPsd5YuI', NULL)
INSERT [dbo].[user_management] ([id], [managerId], [userId], [createdAt], [updatedAt]) VALUES (N'1NLw8txkIiqNzRoUQfyN', N'hlWl0fKzSMAQTyKXsRM5', N'SDMuGZE8ZizIhWMJoyjQ', CAST(N'2020-01-14T02:02:15.0430000+00:00' AS DateTimeOffset), CAST(N'2020-01-14T02:02:15.0430000+00:00' AS DateTimeOffset))
INSERT [dbo].[user_management] ([id], [managerId], [userId], [createdAt], [updatedAt]) VALUES (N'4wTsLUwcQZQlcYSFJg1p', N'eYalbMK7hA9LuufWeLcK', N'7zBT7sDLvwZYZT16nMex', CAST(N'2020-01-16T02:25:57.4370000+00:00' AS DateTimeOffset), CAST(N'2020-01-16T02:25:57.4370000+00:00' AS DateTimeOffset))
INSERT [dbo].[user_management] ([id], [managerId], [userId], [createdAt], [updatedAt]) VALUES (N'5efNloHzwm03lzYWXaal', N'hlWl0fKzSMAQTyKXsRM5', N'7zBT7sDLvwZYZT16nMex', CAST(N'2020-01-16T02:25:57.4370000+00:00' AS DateTimeOffset), CAST(N'2020-01-16T02:25:57.4370000+00:00' AS DateTimeOffset))
INSERT [dbo].[user_management] ([id], [managerId], [userId], [createdAt], [updatedAt]) VALUES (N'EugkK3yQx8WdZy3uRTw1', N'hlWl0fKzSMAQTyKXsRM5', N'bKgUDqgSkd18DPsd5YuI', CAST(N'2020-01-17T09:46:10.0940000+00:00' AS DateTimeOffset), CAST(N'2020-01-17T09:46:10.0940000+00:00' AS DateTimeOffset))
INSERT [dbo].[user_management] ([id], [managerId], [userId], [createdAt], [updatedAt]) VALUES (N'sRVGfVqGLHVr7qKn8pkV', N'eYalbMK7hA9LuufWeLcK', N'SDMuGZE8ZizIhWMJoyjQ', CAST(N'2020-01-14T02:02:15.0430000+00:00' AS DateTimeOffset), CAST(N'2020-01-14T02:02:15.0430000+00:00' AS DateTimeOffset))
INSERT [dbo].[user_management] ([id], [managerId], [userId], [createdAt], [updatedAt]) VALUES (N'YRlsrPGxbFlnJph7vell', N'eYalbMK7hA9LuufWeLcK', N'bKgUDqgSkd18DPsd5YuI', CAST(N'2020-01-17T09:46:10.0940000+00:00' AS DateTimeOffset), CAST(N'2020-01-17T09:46:10.0940000+00:00' AS DateTimeOffset))
INSERT [dbo].[user_role] ([id], [userId], [roleId], [createdAt], [updatedAt]) VALUES (N'0LS8RfCmnk5uDe9jRFOK', N'SDMuGZE8ZizIhWMJoyjQ', N'wuuS2BE7gV5BDhwIL7Em', CAST(N'2020-01-14T02:02:14.5550000+00:00' AS DateTimeOffset), CAST(N'2020-01-14T02:02:14.5550000+00:00' AS DateTimeOffset))
INSERT [dbo].[user_role] ([id], [userId], [roleId], [createdAt], [updatedAt]) VALUES (N'7TgBvtDa2lnLCeWWp3I3', N'bKgUDqgSkd18DPsd5YuI', N'wuuS2BE7gV5BDhwIL7Em', CAST(N'2020-01-17T09:46:09.8470000+00:00' AS DateTimeOffset), CAST(N'2020-01-17T09:46:09.8470000+00:00' AS DateTimeOffset))
INSERT [dbo].[user_role] ([id], [userId], [roleId], [createdAt], [updatedAt]) VALUES (N'GgAx8QoVQt5TBF9cS5AK', N'eYalbMK7hA9LuufWeLcK', N'b4zW8q0XnQPDfmpoDOy2', CAST(N'2019-12-25T11:38:35.1166667+00:00' AS DateTimeOffset), CAST(N'2019-12-25T11:38:35.1166667+00:00' AS DateTimeOffset))
INSERT [dbo].[user_role] ([id], [userId], [roleId], [createdAt], [updatedAt]) VALUES (N'L5FHaRhRnPNlw6f8ebJP', N'7zBT7sDLvwZYZT16nMex', N'5VqPomXM73PWqYKXzYwk', CAST(N'2020-01-16T02:25:57.2860000+00:00' AS DateTimeOffset), CAST(N'2020-01-16T02:25:57.2860000+00:00' AS DateTimeOffset))
INSERT [dbo].[user_role] ([id], [userId], [roleId], [createdAt], [updatedAt]) VALUES (N'M4cReEdksbmvZVEpgILy', N'hlWl0fKzSMAQTyKXsRM5', N'b4zW8q0XnQPDfmpoDOy2', CAST(N'2019-12-25T11:38:35.1200000+00:00' AS DateTimeOffset), CAST(N'2019-12-25T11:38:35.1200000+00:00' AS DateTimeOffset))
INSERT [dbo].[user_station] ([id], [userId], [stationId], [createdAt], [updatedAt]) VALUES (N'eYalbMK7hA9LuuWeLcK', N'eYalbMK7hA9LuufWeLcK', N'18lc1CrzUlVCD3opI2qN', CAST(N'2019-12-25T11:38:35.1133333+00:00' AS DateTimeOffset), CAST(N'2019-12-25T11:38:35.1133333+00:00' AS DateTimeOffset))
INSERT [dbo].[user_station] ([id], [userId], [stationId], [createdAt], [updatedAt]) VALUES (N'eYalbMK7hA9LuuWiLcK', N'eYalbMK7hA9LuufWeLcK', N'1WMKmxYkgNpbLzolqjiJ', CAST(N'2019-12-25T11:38:35.1133333+00:00' AS DateTimeOffset), CAST(N'2019-12-25T11:38:35.1133333+00:00' AS DateTimeOffset))
INSERT [dbo].[user_station] ([id], [userId], [stationId], [createdAt], [updatedAt]) VALUES (N'IYdYQXclVGSdL8p0Fy1F', N'bKgUDqgSkd18DPsd5YuI', N'1WMKmxYkgNpbLzolqjiJ', CAST(N'2020-01-17T09:46:09.9620000+00:00' AS DateTimeOffset), CAST(N'2020-01-17T09:46:09.9620000+00:00' AS DateTimeOffset))
INSERT [dbo].[user_station] ([id], [userId], [stationId], [createdAt], [updatedAt]) VALUES (N'oJXHfCrXlU9NKboIG95z', N'7zBT7sDLvwZYZT16nMex', N'1WMKmxYkgNpbLzolqjiJ', CAST(N'2020-01-17T03:44:26.4480000+00:00' AS DateTimeOffset), CAST(N'2020-01-17T03:44:26.4480000+00:00' AS DateTimeOffset))

