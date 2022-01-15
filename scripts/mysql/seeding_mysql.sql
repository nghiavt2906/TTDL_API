INSERT INTO monitoring_types VALUES
('QTK', 'Quan trắc không khí', 'QTK', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('QTN', 'Quan trắc nước', 'QTN', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO monitoring_groups VALUES
('96uhrqbLC02Q9tjMwPbH', 'Quan trắc khí thải', 'QTK', 'QTKT', 'Quan trắc khí thải tại các khu công nghiệp', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('beTbLaY3J5iLyA2H3GeR', 'Quan trắc nước sinh hoạt', 'QTN', 'QTNSH', 'Quan trắc nước sinh hoạt trong hộ gia đình', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('cNH7rGlPAQzEVsdLaopE', 'Quan trắc nước mặt', 'QTN', 'QTNM', 'Quan trắc nước mặt, sông suối, ao hồ', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('iCXwberyd08CDMLPEPtI', 'Quan trắc khí xung quanh', 'QTK', 'QTKXQ', 'Quan trắc khí xung quanh đô thị, đường phố	', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('p1R0HGiFGdyZFBuLse5b', 'Quan trắc nước ngầm', 'QTN', 'QTNN', 'Quan trắc nước ngầm', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('XTuSjubAZ2OZPiZg4zpc', 'Quan trắc nước thải', 'QTN', 'QTNT', 'Quan trắc nước thải', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO districts VALUES
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
('hhBT7sDLvwZYZT161Mex', 'Quận Phú Nhuận', 'QUANPHUNHUAN'),
('ggBT7sDLvwZYZT161Mex', 'Quận Tân Bình', 'QUANTANBINH'),
('iiBT7sDLvwZYZT161Mex', 'Quận Tân Phú', 'QUANTANPHU'),
('ooBT7sDLvwZYZT161Mex', 'Quận Thủ Đức', 'QUANTHUDUC'),
('ppBT7sDLvwZYZT161Mex', 'Quận Bình Chánh', 'QUANBINHCHANH'),
('yyBT7sDLvwZYZT161Mex', 'Quận Cần Giờ', 'QUANCANGIO'),
('ttBT7sDLvwZYZT161Mex', 'Quận Củ Chi', 'QUANCUCHI'),
('nnBT7sDLvwZYZT161Mex', 'Quận Hóc Môn', 'QUANHOCMON');

INSERT INTO indicators VALUES
('0cxS4VcRuaS17F7vhN0D', 'TMP', 'QTK', 'TMP', 'oC', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('1VShp3DqGd9NSLLbavBK', 'Nhiệt độ', 'QTN', 'Temp', 'oC', 'Nhiệt độ', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('2N5hl8EUsQHBYvNMSozb', 'Mức nước', 'QTN', 'WATER_LEVEL', 'm', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('3ukgdzp14hHjZrXxLPuI', 'TP', 'QTN', 'TP', 'mg/l', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('56GgjhXp43IIxoRFc7Yl', 'Hư?ng gió', 'QTK', 'WD', 'Deg', 'Hướng gió', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('5cYj2g8R35PBmDgbTOM2', 'SS_REAL', 'QTN', 'SS_REAL', 'mg/l', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('7fyRxC2DjV4O4QFUUeIT', 'TSP', 'QTK', 'TSP', 'mg/Nm3', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('7PiMRCiu3UkuYpPOdHTJ', 'FLOW_DAUVAO', 'QTN', 'FLOW_DAUVAO', 'm3/h', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('bKQCfwFLq7SZ1U8iX0iC', 'COD', 'QTN', 'COD', 'mg/l', 'Nồng độ COD', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('cLEtKPGFPGXWiyn0wAiA', 'PM2.5', 'QTK', 'PM25', 'PPM', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('Egs4JUf3Ltwk1q7sjQum', 'DoMau', 'QTN', 'DoMau', 'pt-co', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('emyzT0NiSVNQRnJzbDBC', 'Ozon', 'QTK', 'O3', 'PPM', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('ERWI2xnr8waFWJKA1anW', 'Temp', 'QTN', 'NHIETDO', 'oC', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('fI8Dfk3eN0eEOQ6nz3Di', 'SO2', 'QTK', 'SO2', 'PPM', 'SO2', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('FMHn8rRoZPv961gyEnoU', 'MUCNUOC_NN', 'QTN', 'MUCNUOC_NN', 'm', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('fsrGyPMwi6luUAk8wJ1I', 'SANTILITY', 'QTN', 'SANTILITY', 'mg/l', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('fuA1sKRCJIomxi009VfC', 'Photphates', 'QTN', 'Photphates', 'mg/l', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('HMdhlulrYzviyeAmSevW', 'NO2', 'QTK', 'NO2', 'PPM', 'NO2', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('HZRtXK5QYiUGjgO7NRZy', 'Tốc độ gió giật', 'QTK', 'WSG', 'kph', 'Tốc độ gió giật', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('i26vWIyFl05Ecujsn5BR', 'PM10', 'QTK', 'PM10', 'PPM', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('ir5Np4V7Dxe6PUDleNSX', 'LUULUONG_NN', 'QTN', 'LUULUONG_NN', 'm3/h', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('J0ZJ4wGE1K9b1yWPA1AA', 'DO', 'QTN', 'DO', 'mg/l', 'Nồng độ DO', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('jk78iSWiVpmaTPr2Zb0r', 'CONDUCTIVITY', 'QTN', 'CONDUCTIVITY', 'uS/cm', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('JncWfToHE1PQCqcxa3WB', 'Flow', 'QTN', 'Flow', 'm3/h', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('JT2kQsTtCtdif99mnJ14', 'FLOW_INTOTAL', 'QTN', 'FLOW_INTOTAL', 'm3', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('jtam7JVsjep5EJEs8fn7', 'FL_OUT', 'QTN', 'FL_OUT', 'm3/h', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('jxOsTimJ3R0HaM1yKPKv', 'COD_REAL', 'QTN', 'COD_REAL', 'mg/l', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('K1dCoudxrIJHIuxy7FFT', 'Nhiệt độ_KT', 'QTK', 'NHIETDO_KHITHAI', 'oC', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('K9Qk76PktTkKLLsFjOjl', 'TN', 'QTN', 'TN', 'mg/l', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('Lfbfh2vAUjNAcvki3JP5', 'Tốc độ gió', 'QTK', 'WS', 'kph', 'Tốc độ gió', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('LgVUIVDaFcbrqPBn44vc', 'Áp suất', 'QTK', 'PRESS', 'PA', 'Áp suất', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lLulsTHFNng46IdGKhzn', 'AMONI', 'QTN', 'AMONI', 'mg/l', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('LO27zW7EG51OT0NvioAM', 'Độ ẩm', 'QTK', 'HUMI', '%', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('lygl115ZhbwHtFFcfZ1o', 'PM4.0', 'QTK', 'PM4', 'PPM', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('M1CSg2lUk9hDwE4N3lSK', 'FL_IN', 'QTN', 'FL_IN', 'm3/h', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('m9Bgth2ILQle2nJo5Qzi', 'CO', 'QTK', 'CO', 'PPM', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('OZbgyYv13Sjou0m9yQXU', 'BOD_REAL', 'QTN', 'BOD_REAL', 'mg/l', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('PtEc5ND5ypHigtFAnCUO', 'FLOW_OUTTOTAL', 'QTN', 'FLOW_OUTTOTAL', 'm3/h', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('QTwS5uidRRmwlsPmS11g', 'pH', 'QTN', 'pH', 'Nồng độ', 'PH', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('sldZ6xPLVMHf1HfhMTW1', 'TSS', 'QTN', 'TSS', 'mg/l', 'Nồng độ TSS', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('sqGPSmTzohXJ1KBV81Ov', 'PH_REAL', 'QTN', 'PH_REAL', '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('vEqph5mgGSxZDt3tVIR8', 'PM1.0', 'QTK', 'PM1', 'PPM', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('VlAM50J3PMYxFkmOC2t4', 'Lưu lượng_KT', 'QTK', 'LUULUONG_KHITHAI', 'm3/h', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('vUkPvRl0hMNTzeNRDiI2', 'Flow', 'QTN', 'Flow', 'm3/h', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('wpMTAZLKUmYHFbZ6oRwy', 'NH4', 'QTN', 'NH4', 'mg/l', 'Nồng độ amoniac trong nước', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('Yb7XPS06OCKwqIPa9waw', 'Hướng gió giật', 'QTK', 'WDG', 'Deg', 'Hướng gió giật', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('z4yQlxm1OSRua32UPcqe', 'NITRATE', 'QTN', 'NITRATE', 'mg/l', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO indicator_threshold VALUES
('1Q76GpoI8KEasqLn2rie', 'QTK', 'VlAM50J3PMYxFkmOC2t4', '96uhrqbLC02Q9tjMwPbH', 10000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('3rIOV4YPUWuhtdTZQ700', 'QTN', 'jtam7JVsjep5EJEs8fn7', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('3xKWkUUARmwnO41tfPoo', 'QTK', 'Lfbfh2vAUjNAcvki3JP5', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('5eUmTnzcrluFwkwQSVV7', 'QTK', 'lygl115ZhbwHtFFcfZ1o', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('5J9hAe14XiwOBZoTeWuU', 'QTN', '7PiMRCiu3UkuYpPOdHTJ', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('5u4DxrnzIM4BItmls5Wv', 'QTK', 'vEqph5mgGSxZDt3tVIR8', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('60x1Bn4ZaxBsMXuPKVJl', 'QTK', '0cxS4VcRuaS17F7vhN0D', '96uhrqbLC02Q9tjMwPbH', 40, 20, 'Nhiệt độ vùng an toàn', 'Nhiệt độ vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('71Rxs4QALH3qOBAAM6Kg', 'QTN', 'sldZ6xPLVMHf1HfhMTW1', 'cNH7rGlPAQzEVsdLaopE', 100, 0, 'TSS trong vùng an toàn', 'TSS trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('73FtA3hc2rrbXZERvCAx', 'QTN', 'lLulsTHFNng46IdGKhzn', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('882WqL4KFrqNYlVEqLVn', 'QTK', 'LgVUIVDaFcbrqPBn44vc', '96uhrqbLC02Q9tjMwPbH', 300000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('8zaGv3SvhiU5VC4aecye', 'QTN', 'wpMTAZLKUmYHFbZ6oRwy', 'cNH7rGlPAQzEVsdLaopE', 3, 0, 'NH4+N trong vùng an toàn', 'NH4+N trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('a4hfyus1e4GXirP3bWZG', 'QTK', 'cLEtKPGFPGXWiyn0wAiA', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('AVFxZuh6YtPV7MRB0GCU', 'QTN', '5cYj2g8R35PBmDgbTOM2', 'cNH7rGlPAQzEVsdLaopE', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('BDrB8uuJMgZAmNEbNxgs', 'QTN', 'M1CSg2lUk9hDwE4N3lSK', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('BFOnUnuhJz3evxksQ9Ya', 'QTK', 'LgVUIVDaFcbrqPBn44vc', 'iCXwberyd08CDMLPEPtI', 300000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('BKE734wFOq98x1zoUVTN', 'QTN', 'wpMTAZLKUmYHFbZ6oRwy', 'XTuSjubAZ2OZPiZg4zpc', 3, 0, 'NH4+N trong vùng an toàn', 'NH4+N trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('BoY1nfMTc5o1J4WnELyC', 'QTK', 'HMdhlulrYzviyeAmSevW', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('bwUgYCHaTPg0qPvKW7zT', 'QTK', 'Yb7XPS06OCKwqIPa9waw', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('CkUyv12M0vPKhTHky0Qh', 'QTK', 'LO27zW7EG51OT0NvioAM', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('cxzdpT6QupTx4skTu25k', 'QTK', 'K1dCoudxrIJHIuxy7FFT', '96uhrqbLC02Q9tjMwPbH', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('d3VlmRapsh4Fx3O1raIm', 'QTN', 'QTwS5uidRRmwlsPmS11g', 'XTuSjubAZ2OZPiZg4zpc', 9, 5.5, 'PH trong vùng an toàn', 'PH trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('d3zPRPOo9YuoGKO9PHIz', 'QTK', 'emyzT0NiSVNQRnJzbDBC', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('DK79An7cvaER6qEicvYh', 'QTK', '56GgjhXp43IIxoRFc7Yl', '96uhrqbLC02Q9tjMwPbH', 30000, 0, 'Hướng gió vùng an toàn', 'Hướng gió vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('DSMoqbqkHOOUbghdWBE8', 'QTK', 'vEqph5mgGSxZDt3tVIR8', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('ebjnNYLTdDgAcIUxslgu', 'QTK', 'fI8Dfk3eN0eEOQ6nz3Di', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('eFjRNcuRBivFZLMZ9bJQ', 'QTN', 'VlAM50J3PMYxFkmOC2t4', '96uhrqbLC02Q9tjMwPbH', 1000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('EKlsL88ZrFQtTPCsdSiv', 'QTN', 'fuA1sKRCJIomxi009VfC', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('epqOAYx8tspuyveKApdi', 'QTN', 'wpMTAZLKUmYHFbZ6oRwy', 'beTbLaY3J5iLyA2H3GeR', 3, 0, 'NH4+N trong vùng an toàn', 'NH4+N trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('eq7ULhnVqknZ0FsgHXJd', 'QTK', '0cxS4VcRuaS17F7vhN0D', 'iCXwberyd08CDMLPEPtI', 40, 20, 'Nhiệt độ vùng an toàn', 'Nhiệt độ vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('Es0UdaZoJpbYQsB5gQR1', 'QTK', 'fI8Dfk3eN0eEOQ6nz3Di', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('Ex2FI6yfdFHFbTbkPwm8', 'QTN', 'sldZ6xPLVMHf1HfhMTW1', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, 'TSS trong vùng an toàn', 'TSS trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('g1WxMgLPH0UPctwX0j2y', 'QTK', 'HMdhlulrYzviyeAmSevW', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('gHY4zKAItScy8g6tN3L7', 'QTN', 'fsrGyPMwi6luUAk8wJ1I', 'cNH7rGlPAQzEVsdLaopE', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('gOIcV6UvFwfA3ztNIiJd', 'QTN', '2N5hl8EUsQHBYvNMSozb', 'cNH7rGlPAQzEVsdLaopE', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('hFEgsauqqpVAhfyRIl5c', 'QTN', 'QTwS5uidRRmwlsPmS11g', 'cNH7rGlPAQzEVsdLaopE', 9, 5.5, 'PH trong vùng an toàn', 'PH trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('hYQoox1Wyr70vNh5EvxE', 'QTN', 'J0ZJ4wGE1K9b1yWPA1AA', 'beTbLaY3J5iLyA2H3GeR', 2, 0, 'DO trong vùng an toàn', 'DO trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('I6251N3ciSPfiV9HoeXg', 'QTN', '1VShp3DqGd9NSLLbavBK', 'XTuSjubAZ2OZPiZg4zpc', 35, 20, 'Nhiệt độ trong vùng an toàn', 'Nhiệt độ trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('INQwu4HNI09zEAzilLkd', 'QTK', '7fyRxC2DjV4O4QFUUeIT', '96uhrqbLC02Q9tjMwPbH', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('IXpm6Xx7KtoYBGUtIxBD', 'QTN', 'OZbgyYv13Sjou0m9yQXU', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('J3vOGRdVS9VdR16l2oVm', 'QTN', 'z4yQlxm1OSRua32UPcqe', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('jAMLfYMbBqkTP3z5GVP7', 'QTN', 'sldZ6xPLVMHf1HfhMTW1', 'beTbLaY3J5iLyA2H3GeR', 100, 0, 'TSS trong vùng an toàn', 'TSS trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('jRCTzI7dMuwED3q26dnA', 'QTN', 'bKQCfwFLq7SZ1U8iX0iC', 'cNH7rGlPAQzEVsdLaopE', 150, 50, 'COD trong vùng an toàn', 'COD trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('K0vl9Q3Elhe5GcJ8RcGa', 'QTN', 'PtEc5ND5ypHigtFAnCUO', 'XTuSjubAZ2OZPiZg4zpc', 1000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('k51X5UV1PskypXqLq2jo', 'QTK', 'cLEtKPGFPGXWiyn0wAiA', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('kxesOs5MfjDtwuNftQVu', 'QTN', 'J0ZJ4wGE1K9b1yWPA1AA', 'cNH7rGlPAQzEVsdLaopE', 2, 20, 'DO trong vùng an toàn', 'DO trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('L2AqIgOR0wXSo7lS9C87', 'QTN', 'sqGPSmTzohXJ1KBV81Ov', 'cNH7rGlPAQzEVsdLaopE', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('LBlvVz3ugkyu1KmvROZx', 'QTK', 'i26vWIyFl05Ecujsn5BR', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('mHKierSOt5dvilpZItaN', 'QTK', 'Yb7XPS06OCKwqIPa9waw', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('Mvc6CD6bmIVmT8UmcRZp', 'QTN', '3ukgdzp14hHjZrXxLPuI', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('MwaU4znVlSPJR1gRTRJG', 'QTN', 'bKQCfwFLq7SZ1U8iX0iC', 'XTuSjubAZ2OZPiZg4zpc', 50, 0, 'COD trong vùng an toàn', 'COD trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('OJ16W1TzYByJ8zGd3NKX', 'QTN', 'K1dCoudxrIJHIuxy7FFT', '96uhrqbLC02Q9tjMwPbH', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('OJULocC23A0sVI3ioROU', 'QTK', 'Lfbfh2vAUjNAcvki3JP5', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('oqGxgB5bRbjVKf3trv0Z', 'QTN', 'OZbgyYv13Sjou0m9yQXU', 'cNH7rGlPAQzEVsdLaopE', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('PgUjFifPJwAhs6H9p9aE', 'QTN', 'QTwS5uidRRmwlsPmS11g', 'beTbLaY3J5iLyA2H3GeR', 9, 5.5, 'PH trong vùng an toàn', 'PH trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('pT47yxXMIQMYt53OmcmB', 'QTK', 'm9Bgth2ILQle2nJo5Qzi', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('QJ9SgZnHZWvYhjdkevBD', 'QTK', 'lygl115ZhbwHtFFcfZ1o', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('qlSehcZHsCCL27WbATAT', 'QTK', 'emyzT0NiSVNQRnJzbDBC', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('rH9nrQViLYqCHkzT1BoB', 'QTN', 'JT2kQsTtCtdif99mnJ14', 'XTuSjubAZ2OZPiZg4zpc', 1000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('rVdN6BNhtkj1d5FmtpVV', 'QTN', '1VShp3DqGd9NSLLbavBK', 'beTbLaY3J5iLyA2H3GeR', 35, 20, 'Nhiệt độ trong vùng an toàn', 'Nhiệt độ trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('rVo7cYvGO1ljkoCnz5tF', 'QTN', 'bKQCfwFLq7SZ1U8iX0iC', 'beTbLaY3J5iLyA2H3GeR', 50, 0, 'COD trong vùng an toàn', 'COD trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('SG0tTSOVJ0dYMi0fLC1i', 'QTK', 'i26vWIyFl05Ecujsn5BR', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('SGcWFik7ewdbOSD3H2lo', 'QTN', 'Egs4JUf3Ltwk1q7sjQum', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('sKhV1Mtc25kif7Hv9OyI', 'QTK', 'LO27zW7EG51OT0NvioAM', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('sO4zKad5MXk9XiFKirpn', 'QTN', 'J0ZJ4wGE1K9b1yWPA1AA', 'XTuSjubAZ2OZPiZg4zpc', 2, 0, 'DO trong vùng an toàn', 'DO trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('sZcObnDyK1NWwajUmXck', 'QTN', 'JncWfToHE1PQCqcxa3WB', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('TTdPIwFdW7PQgjvwbLKr', 'QTN', 'jk78iSWiVpmaTPr2Zb0r', 'cNH7rGlPAQzEVsdLaopE', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('uibBg0ZETrjXxvMILGq0', 'QTN', '1VShp3DqGd9NSLLbavBK', 'cNH7rGlPAQzEVsdLaopE', 35, 30, 'Nhiệt độ trong vùng an toàn', 'Nhiệt độ trong vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('ur3bpl50RXZSy7ouQLAt', 'QTN', 'ERWI2xnr8waFWJKA1anW', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('vA31D9eeGP4GCiMX6MwO', 'QTK', 'm9Bgth2ILQle2nJo5Qzi', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('VifCiaL6r05fRdwcmbso', 'QTN', 'K9Qk76PktTkKLLsFjOjl', 'XTuSjubAZ2OZPiZg4zpc', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('vxfOJPLMDQYDNNNIMyEV', 'QTK', 'HZRtXK5QYiUGjgO7NRZy', 'iCXwberyd08CDMLPEPtI', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('vY0Rsur8BhGf97GsLJAC', 'QTN', 'jxOsTimJ3R0HaM1yKPKv', 'cNH7rGlPAQzEVsdLaopE', 100, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('XiGo3KvIZNe995b5lNTZ', 'QTK', 'HZRtXK5QYiUGjgO7NRZy', '96uhrqbLC02Q9tjMwPbH', 30000, 0, '', '', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('YPgdx9lh3WuypDMdq4vr', 'QTK', '56GgjhXp43IIxoRFc7Yl', 'iCXwberyd08CDMLPEPtI', 30000, 0, 'Hướng gió vùng an toàn', 'Hướng gió vùng cảnh báo', NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO permissions (id, name, displayName) VALUES ('11qPomXM73PWqYKXzYwk', 'edit_data', 'Chỉnh sửa dữ liệu');
INSERT INTO permissions (id, name, displayName) VALUES ('12qPomXM73PWqYKXzYwk', 'delete_data', 'Xóa dữ liệu');
INSERT INTO permissions (id, name, displayName) VALUES ('13qPomXM73PWqYKXzYwk', 'insert_data', 'Thêm dữ liệu');
INSERT INTO permissions (id, name, displayName) VALUES ('14qPomXM73PWqYKXzYwk', 'view_station_config', 'Xem thông tin trạm');
INSERT INTO permissions (id, name, displayName) VALUES ('15qPomXM73PWqYKXzYwk', 'edit_station_config', 'Sửa thông tin trạm');
INSERT INTO permissions (id, name, displayName) VALUES ('16qPomXM73PWqYKXzYwk', 'insert_station', 'Thêm mới trạm');
INSERT INTO permissions (id, name, displayName) VALUES ('17qPomXM73PWqYKXzYwk', 'delete_station', 'Xóa trạm');
INSERT INTO permissions (id, name, displayName) VALUES ('18qPomXM73PWqYKXzYwk', 'view_camera_info', 'Xem thông tin camera');
INSERT INTO permissions (id, name, displayName) VALUES ('19qPomXM73PWqYKXzYwk', 'edit_camera_info', 'Sửa thông tin camera');
INSERT INTO permissions (id, name, displayName) VALUES ('20qPomXM73PWqYKXzYwk', 'insert_camera', 'Thêm mới camera');
INSERT INTO permissions (id, name, displayName) VALUES ('21qPomXM73PWqYKXzYwk', 'delete_camera', 'Xóa camera');
INSERT INTO permissions (id, name, displayName) VALUES ('22qPomXM73PWqYKXzYwk', 'view_stream_camera', 'Xem camera trực tuyến');
INSERT INTO permissions (id, name, displayName) VALUES ('23qPomXM73PWqYKXzYwk', 'sample_control', 'Điều khiển lấy mẫu');
INSERT INTO permissions (id, name, displayName) VALUES ('24qPomXM73PWqYKXzYwk', 'check_station_location', 'Kiểm tra vị trí trạm quan trắc');
INSERT INTO permissions (id, name, displayName) VALUES ('25qPomXM73PWqYKXzYwk', 'view_monitoring_group', 'Xem thông tin nhóm quan trắc');
INSERT INTO permissions (id, name, displayName) VALUES ('26qPomXM73PWqYKXzYwk', 'edit_monitoring_group', 'Sửa thông tin nhóm quan trắc');
INSERT INTO permissions (id, name, displayName) VALUES ('27qPomXM73PWqYKXzYwk', 'insert_monitoring_group', 'Thêm thông tin nhóm quan trắc');
INSERT INTO permissions (id, name, displayName) VALUES ('28qPomXM73PWqYKXzYwk', 'delete_monitoring_group', 'Xóa nhóm quan trắc');
INSERT INTO permissions (id, name, displayName) VALUES ('29qPomXM73PWqYKXzYwk', 'view_indicator', 'Xem chỉ số');
INSERT INTO permissions (id, name, displayName) VALUES ('30qPomXM73PWqYKXzYwk', 'edit_indicator', 'Sửa chỉ số');
INSERT INTO permissions (id, name, displayName) VALUES ('31qPomXM73PWqYKXzYwk', 'insert_indicator', 'Thêm chỉ số');
INSERT INTO permissions (id, name, displayName) VALUES ('32qPomXM73PWqYKXzYwk', 'delete_indicator', 'Xóa chỉ số');
INSERT INTO permissions (id, name, displayName) VALUES ('33qPomXM73PWqYKXzYwk', 'view_indicator_threshold', 'Xem ngưỡng chí số');
INSERT INTO permissions (id, name, displayName) VALUES ('34qPomXM73PWqYKXzYwk', 'edit_indicator_threshold', 'Sửa ngưỡng chỉ số');
INSERT INTO permissions (id, name, displayName) VALUES ('35qPomXM73PWqYKXzYwk', 'insert_indicator_threshold', 'Thêm ngưỡng chỉ số');
INSERT INTO permissions (id, name, displayName) VALUES ('36qPomXM73PWqYKXzYwk', 'delete_indicator_threshold', 'Xóa ngưỡng chỉ số');
INSERT INTO permissions (id, name, displayName) VALUES ('37qPomXM73PWqYKXzYwk', 'view_user_group', 'Xem thông tin nhóm người dùng');
INSERT INTO permissions (id, name, displayName) VALUES ('38qPomXM73PWqYKXzYwk', 'edit_user_group', 'Sửa thông tin nhóm người dùng');
INSERT INTO permissions (id, name, displayName) VALUES ('39qPomXM73PWqYKXzYwk', 'insert_user_group', 'Thêm nhóm người dùng');
INSERT INTO permissions (id, name, displayName) VALUES ('40qPomXM73PWqYKXzYwk', 'delete_user_group', 'Xóa nhóm người dùng');
INSERT INTO permissions (id, name, displayName) VALUES ('41qPomXM73PWqYKXzYwk', 'view_user_info', 'Xem thông tin người dùng');
INSERT INTO permissions (id, name, displayName) VALUES ('42qPomXM73PWqYKXzYwk', 'edit_user_info', 'Sửa thông tin người dùng');
INSERT INTO permissions (id, name, displayName) VALUES ('43qPomXM73PWqYKXzYwk', 'insert_user', 'Thêm người dùng');
INSERT INTO permissions (id, name, displayName) VALUES ('44qPomXM73PWqYKXzYwk', 'delete_user', 'Xóa người dùng');
INSERT INTO permissions (id, name, displayName) VALUES ('45qPomXM73PWqYKXzYwk', 'view_general_report', 'Xem báo cáo tổng quát');
INSERT INTO permissions (id, name, displayName) VALUES ('46qPomXM73PWqYKXzYwk', 'view_specific_report', 'Xem báo cáo chi tiết');
INSERT INTO permissions (id, name, displayName) VALUES ('47qPomXM73PWqYKXzYwk', 'export_report', 'Export báo cáo');
INSERT INTO permissions (id, name, displayName) VALUES ('48qPomXM73PWqYKXzYwk', 'view_activity_diary', 'Xem nhật ký');
INSERT INTO permissions (id, name, displayName) VALUES ('49qPomXM73PWqYKXzYwk', 'delete_activity_diary', 'Xóa nhật ký');
INSERT INTO permissions (id, name, displayName) VALUES ('50qPomXM73PWqYKXzYwk', 'export_diary', 'Xuất nhật ký');
INSERT INTO permissions (id, name, displayName) VALUES ('52qPomXM73PWqYKXzYwk', 'view_system_config', 'Xem hệ thống');
INSERT INTO permissions (id, name, displayName) VALUES ('53qPomXM73PWqYKXzYwk', 'edit_system_config', 'Sửa dữ liệu hệ thống');
INSERT INTO permissions (id, name, displayName) VALUES ('54qPomXM73PWqYKXzYwk', 'upload_data', 'Nhập số liệu ');
INSERT INTO permissions (id, name, displayName) VALUES ('55qPomXM73PWqYKXzYwk', 'auto_update_station', 'Tự động cập nhật trạm mới');

INSERT INTO characters (id, name, isDefault) VALUES ('2GStauJg3CXg6r5KxKyo', 'Lãnh đạo Sở', 1);
INSERT INTO characters (id, name, isDefault) VALUES ('SAyEdvcsTETcIdfH6FtB', 'Quan tri he thong', 1);

INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('08n9Z3BhEZk9qB3hGKor', 'SAyEdvcsTETcIdfH6FtB', '11qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('1oMaHGRtOnEtPQ1NN3Oe', 'SAyEdvcsTETcIdfH6FtB', '53qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('1Uo3vxHNdGKZTbHWSHIh', '2GStauJg3CXg6r5KxKyo', '24qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('2bwbkqiS6F1piuMZ5r33', 'SAyEdvcsTETcIdfH6FtB', '23qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('2UDyeMi3d9Yknjvd9kLl', '2GStauJg3CXg6r5KxKyo', '47qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('34jDJRGCfsOieXB0QUK2', '2GStauJg3CXg6r5KxKyo', '25qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('4TnItYovnnhfeLKqLG3X', '2GStauJg3CXg6r5KxKyo', '49qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('5kBfGvypIxlRQuDcYZ6J', '2GStauJg3CXg6r5KxKyo', '28qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('5tneD2JtjYK4g4Znz2eO', '2GStauJg3CXg6r5KxKyo', '22qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('6GZW4upgkepP4qtVwO60', '2GStauJg3CXg6r5KxKyo', '44qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('85bGmVfUum0M990lq6eW', '2GStauJg3CXg6r5KxKyo', '33qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('apYEw7RvXGFIJYJFKmCL', '2GStauJg3CXg6r5KxKyo', '53qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('BDkdrxNaq1JpZJzBS5Sq', '2GStauJg3CXg6r5KxKyo', '50qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('BmBf7gsUqYZ78uefnSAH', 'SAyEdvcsTETcIdfH6FtB', '45qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('bO4BGyarIfxgJaSRDXNg', 'SAyEdvcsTETcIdfH6FtB', '16qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('BOvcrmZKm0sxsghBHPuz', '2GStauJg3CXg6r5KxKyo', '39qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('BqXLJklUdqG7qCgutDAn', 'SAyEdvcsTETcIdfH6FtB', '14qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('bSDNBpjOEAL6hhSM9Vt3', 'SAyEdvcsTETcIdfH6FtB', '46qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('BxGY09NYXabf8PGaq8ii', '2GStauJg3CXg6r5KxKyo', '46qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('cltM4H5IPTvzcgOQaYNp', 'SAyEdvcsTETcIdfH6FtB', '29qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('CuN7wU1fJGSjrTvAYGzL', 'SAyEdvcsTETcIdfH6FtB', '33qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('dHX09OZpOTaR1Oll9q90', '2GStauJg3CXg6r5KxKyo', '27qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('DJEgoxbcpMuRHcT0MLE1', '2GStauJg3CXg6r5KxKyo', '29qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('dtmObszChLeMEPMvrQrQ', '2GStauJg3CXg6r5KxKyo', '16qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('DZyb5uBLqzmcvkbMMHrJ', 'SAyEdvcsTETcIdfH6FtB', '27qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('e6OtlNxfyuB4Sy5DSGlh', 'SAyEdvcsTETcIdfH6FtB', '22qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('E7YmK5HABA1ar122ERJW', 'SAyEdvcsTETcIdfH6FtB', '48qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('ehhq1KH64YyOnc2ozNPt', 'SAyEdvcsTETcIdfH6FtB', '34qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('etbwFtCwuaxRHcvySwOH', 'SAyEdvcsTETcIdfH6FtB', '31qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('EvuPacN1dEjmlWItY42i', 'SAyEdvcsTETcIdfH6FtB', '13qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('Exbk196JzLljxDLEzq5q', 'SAyEdvcsTETcIdfH6FtB', '50qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('eXEOVl3cjrEuqpPXgjVP', '2GStauJg3CXg6r5KxKyo', '30qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('fH5W8JElG13rMc7UUsE8', 'SAyEdvcsTETcIdfH6FtB', '41qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('fI8vz8kplxMb4lWMycqe', 'SAyEdvcsTETcIdfH6FtB', '26qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('fONrUDXBfa15z3Sl0o0y', 'SAyEdvcsTETcIdfH6FtB', '37qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('FUUnA9Cjc3rlTJk3BEmm', '2GStauJg3CXg6r5KxKyo', '36qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('FvcUVro3qexFRX2mcAPQ', 'SAyEdvcsTETcIdfH6FtB', '39qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('FZEnGTRCfwCRp0nzdHQ6', '2GStauJg3CXg6r5KxKyo', '13qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('GEFGc0K7dEgLRa42bQZt', '2GStauJg3CXg6r5KxKyo', '34qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('gj3UHPtQO44h7COFynj1', '2GStauJg3CXg6r5KxKyo', '45qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('GsJ10vtAHUuq5wawFXq1', 'SAyEdvcsTETcIdfH6FtB', '47qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('HyamOoHGsMahJUG0kPuv', 'SAyEdvcsTETcIdfH6FtB', '32qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('HZR5hYCy6Km5ZlIk0Syk', 'SAyEdvcsTETcIdfH6FtB', '18qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('IaI5HPm1EQ3juaJciCwH', '2GStauJg3CXg6r5KxKyo', '12qPomXM73PWqYKXzYwk', 0);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('ibnA8Wdtd0lX6YRkMxqD', 'SAyEdvcsTETcIdfH6FtB', '35qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('icwqFasRJdeWCTNT2Tmg', 'SAyEdvcsTETcIdfH6FtB', '43qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('IFvtBFfSQJbWprH29DXN', '2GStauJg3CXg6r5KxKyo', '48qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('jfLbliGdmHOVcqvZTQqX', '2GStauJg3CXg6r5KxKyo', '15qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('JlbB6O0aunXSd94IrKrd', 'SAyEdvcsTETcIdfH6FtB', '40qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('JrQCxszNOplPSKG6VpzM', '2GStauJg3CXg6r5KxKyo', '21qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('jtdFphggaiHM6s11BUFM', '2GStauJg3CXg6r5KxKyo', '37qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('jYQkOA8i783oMsQlqCTu', 'SAyEdvcsTETcIdfH6FtB', '49qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('jzf3lmLzeZQ7RAhXN2UQ', '2GStauJg3CXg6r5KxKyo', '14qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('KCnnQBGRiAsJMIUHYNTt', 'SAyEdvcsTETcIdfH6FtB', '15qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('LC27IAXNCb0jyNGshG4l', '2GStauJg3CXg6r5KxKyo', '54qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('mtAGtnzAqKrtwln7xELg', 'SAyEdvcsTETcIdfH6FtB', '21qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('NZVjfV8TincjB7BBztf6', 'SAyEdvcsTETcIdfH6FtB', '17qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('OP25x4t2XqwMCqB0VrDI', '2GStauJg3CXg6r5KxKyo', '43qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('oucu8JWM5vQEV8gIwzpZ', 'SAyEdvcsTETcIdfH6FtB', '36qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('pN3Njjmbd8EuBdiHDJHf', '2GStauJg3CXg6r5KxKyo', '19qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('qjYfnOFNdgSVp4daMWta', '2GStauJg3CXg6r5KxKyo', '26qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('qPhv4OfM1iHMLgDV5XU8', '2GStauJg3CXg6r5KxKyo', '31qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('RuiYB4xQku23bb7QX25T', 'SAyEdvcsTETcIdfH6FtB', '30qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('sGFrATg31jCBrL47rzpm', '2GStauJg3CXg6r5KxKyo', '23qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('SIfWG7ioNnY0z2Zy5htu', 'SAyEdvcsTETcIdfH6FtB', '54qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('TbTPPfyMyPc2RhBFO7bz', '2GStauJg3CXg6r5KxKyo', '52qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('teIQbX3riuUhwfYqaZjN', 'SAyEdvcsTETcIdfH6FtB', '42qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('tUlSOKjtgbeJwK27xm9v', 'SAyEdvcsTETcIdfH6FtB', '19qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('UsDAde3FExhNxplQ0FRa', '2GStauJg3CXg6r5KxKyo', '35qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('uvcxcWcjrzczvzOk7XmO', 'SAyEdvcsTETcIdfH6FtB', '20qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('Wb4He3oWihuBgstFbgc5', '2GStauJg3CXg6r5KxKyo', '42qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('WcZOpVk0D56n8gJwYgiz', '2GStauJg3CXg6r5KxKyo', '40qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('wdfdTG631bXuF407wxeN', 'SAyEdvcsTETcIdfH6FtB', '25qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('wvGSHDqHe12CD2lznsVs', 'SAyEdvcsTETcIdfH6FtB', '12qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('wwSQrIrMqMvNxFJsNreh', '2GStauJg3CXg6r5KxKyo', '11qPomXM73PWqYKXzYwk', 0);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('x6IPYbW9hN9IlL90H2ST', 'SAyEdvcsTETcIdfH6FtB', '52qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('XCutVIQYs9yBxwqBeq7g', '2GStauJg3CXg6r5KxKyo', '32qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('xpK4khWrFM9430LxSVs6', 'SAyEdvcsTETcIdfH6FtB', '28qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('xQCobjyLI9RZsN2UKh5q', 'SAyEdvcsTETcIdfH6FtB', '24qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('YDLxlMyrNjBoeErGkf3Z', 'SAyEdvcsTETcIdfH6FtB', '38qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('YhXqNnKWFjVR153ZQTqX', 'SAyEdvcsTETcIdfH6FtB', '44qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('Yv3doAgc6SZX6c2K6N1C', '2GStauJg3CXg6r5KxKyo', '17qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('YZzKn1tkAGmjC2tXpUxp', '2GStauJg3CXg6r5KxKyo', '18qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('zDHLCq6bI6tKmg5jfhQX', '2GStauJg3CXg6r5KxKyo', '38qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('zDPuBFO8hXqVBtibjIw2', '2GStauJg3CXg6r5KxKyo', '41qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('zHbXUEQC8AX9vYnV2U0j', '2GStauJg3CXg6r5KxKyo', '20qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('ttbXUEQC8AX9vYnV2U0j', '2GStauJg3CXg6r5KxKyo', '55qPomXM73PWqYKXzYwk', 1);
INSERT INTO character_permission (id, characterId, permissionId, permissionStatus) VALUES ('ggbXUEQC8AX9vYnV2U0j', 'SAyEdvcsTETcIdfH6FtB', '55qPomXM73PWqYKXzYwk', 1);

INSERT INTO managers VALUES
('eYalbMK7hA9LuufWeLcK', '2GStauJg3CXg6r5KxKyo', 'Bạch Quốc Việt', 'vietbq@centic.vn', '$2b$10$3ZGZVyAfE2biRuFXaloiF.s4rCeXGFX3zz6cUtguGXvxfNgAORb8O','0968405800', 'Trung tâm vi m?ch Đà N?ng - CENTIC', '15 Quang Trung H?i Châu Đà N?ng', 1, 1, NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('hlWl0fKzSMAQTyKXsRM5', '2GStauJg3CXg6r5KxKyo', 'Đỗ Hữu Tín', 'tindh@centic.vn', '$2b$10$oC4H4EcytzlGX4sk.nuBsOu940IraiPQL8GRLGPDEb7ht8Q1lbHba', '0123456789', 'Trung tâm vi m?ch Đà N?ng - CENTIC', '15 Quang Trung H?i Châu Đà N?ng', 1,1, NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

INSERT INTO manager_access_tokens VALUES ('lGVrWRmo2S9FvWNKS2KzqWUgpMdUBkOU7XRucUd4', 'eYalbMK7hA9LuufWeLcK', null), ('RSYU0E4hBk8Z3LSOqYS1QC1y1Ls4oitANQLPW0p8', 'hlWl0fKzSMAQTyKXsRM5', null);

INSERT INTO `systems` (`id`, `idSystem`, `name`, `value`) VALUES
('1', '1', 'smsAlertThreshold', 'TTQTMT thong bao: Tram $TENTRAM co chi so $SENSORS vuot nguong an toan. De nghi a/c phu trach tram kiem tra lai. Tran trong!'),
('10', '1', 'emailAlertStructure', '<p>Kính gửi anh(chị) phụ trách theo dõi $TENTRAM!<p>\r\n</br>\r\n<p>$TRUNGTAM gửi email cảnh báo dữ liệu gửi về không đúng cấu trúc.Cụ thể:</p>\r\n</br>\r\n<p>- Tên trạm: $TENTRAM</p>\r\n<p>- Ký hiệu trạm: $KYHIEUTRAM</p>\r\n<p>- Lỗi quan trắc: $NHOMQUANTRAC</p>\r\n<p>- Lỗi: File ftp gửi về không đúng cấu trúc</p>\r\n</br>\r\n<p>Đề nghị anh(chị) theo dõi và rà soát lỗi dữ liệu gửi về của trạm $TENTRAM</p>\r\n</br>\r\n<p>Trân trọng,</p>\r\n<p>$TRUNGTAM</p>'),
('11', '1', 'titleEmailAlertBattery', 'Cảnh báo file truyền về không đúng cấu trúc'),
('12', '1', 'emailAlertBattery', NULL),
('13', '1', 'numberOfAlertSms', '5'),
('14', '1', 'numberOfAlertEmail', '5'),
('15', '1', 'alertSmsStatus', '0'),
('16', '1', 'alertEmailStatus', '0'),
('17', '1', 'paramThresholdFirstlevel', '5'),
('18', '1', 'paramThresholdSecondlevel', '10'),
('19', '1', 'paramDisconnectionFirstlevel', '60'),
('2', '1', 'smsAlertDisconnection', 'TTQTMT thong bao: Tram $TENTRAM khong truyen du lieu ve trung tam. De nghi a/c phu trach $TENTRAM kiem tra lai. Tran trong!'),
('20', '1', 'paramDisconnectionSecondlevel', '120'),
('21', '1', 'alertStructureStatus', '1'),
('22', '1', 'ftpserverStnmt', ''),
('23', '1', 'ftpusernameStnmt', ''),
('24', '1', 'ftppasswordStnmt', ''),
('25', '1', 'ftpserverBtnmt', '192.168.1.23'),
('26', '1', 'ftpusernameBtnmt', ''),
('27', '1', 'dirReceiveFtp', '/ArriveFiles'),
('28', '1', 'dirSaveFtp', '/DataFiles'),
('29', '1', 'dirWrongFtp', '/ErrorFiles'),
('3', '1', 'smsAlertStructure', 'TTQTMT thong bao: Tram $TENTRAM gui file du lieu khong dung cau truc. De nghi a/c phu trach $TENTRAM kiem tra lai. Tran trong!'),
('30', '1', 'upperThresholdColor', 'red'),
('31', '1', 'lowerThresholdColor', 'red'),
('32', '1', 'warningThresholdColor', 'red'),
('33', '1', 'safetyThresholdColor', 'gree'),
('34', '1', 'mailServer', 'huutin25021993@gmail.com'),
('35', '1', 'mailPassword', ''),
('36', '1', 'mailServername', 'Trung tâm Quan trắc Môi trường'),
('37', '1', 'mailClientId', '590257600088-se1msnnvb9jd57nv3b8322f1mv1dm36r.apps.googleusercontent.com'),
('38', '1', 'mailClientSecret', 'ZELxuqPeJfL8MkEt9OLbz21h'),
('39', '1', 'mailRefreshToken', '1/EmmooZsWXI4mFEgbbGuUgUryTFnDMeu-bLsXP_Co5D8'),
('4', '1', 'smsAlertBattery', NULL),
('40', '1', 'mailAccessToken', 'ya29.GltrBxFxaGeWny8Xso2cXpTCuYTOSOniIe73I6UVrxm5YqomyYfSYuuEoLSTP6FiDG8TyPwn_fHz2My-AUPki0zXuwL0BqhtG65DRmMPssxyogARqDn2xhN1QbuL'),
('41', '1', 'smsServer', 'http://49.156.52.24:5993/SmsService.asmx'),
('42', '1', 'smsUsername', 'centic'),
('43', '1', 'smsPassword', 'oipd645xlcj7va5'),
('44', '1', 'ftpportStnmt', ''),
('45', '1', 'ftpusernameBtnmt', ''),
('46', '1', 'ftpportBtnmt', ''),
('5', '1', 'titleEmailAlertThreshold', 'Cảnh báo quan trắc vượt ngưỡng'),
('6', '1', 'emailAlertThreshold', '<p>Kính gửi anh(chị) phụ trách theo dõi $TENTRAM!<p>\r\n</br>\r\n<p>$TRUNGTAM gửi email cảnh báo vượt ngưỡng quan trắc môi trường.Cụ thể:</p>\r\n</br>\r\n<p>- Tên trạm: $TENTRAM</p>\r\n<p>- Ký hiệu trạm: $KYHIEUTRAM</p>\r\n<p>- Loại quan trắc: $NHOMQUANTRAC</p>\r\n<p>- Chỉ số vượt ngưỡng: $SENSORS</p>\r\n<p>- Thời gian đo: $THOIGIANDO</p>\r\n</br>\r\n<p>Đề nghị anh(chị) theo dõi và xử lý vượt ngưỡng tại trạm $TENTRAM</p>\r\n</br>\r\n<p>Trân trọng,</p> \r\n<p>$TRUNGTAM</p>'),
('7', '1', 'titleEmailAlertDisconnection', 'Cảnh báo Trạm không truyền số liệu'),
('8', '1', 'emailAlertDisconnectionn', '<p>Kính gửi anh(chị) phụ trách theo dõi $TENTRAM!<p>\r\n</br>\r\n<p>$TRUNGTAM gửi email cảnh báo Trạm không truyền dữ liệu.Cụ thể:</p>\r\n</br>\r\n<p>- Tên trạm: $TENTRAM</p>\r\n<p>- Ký hiệu trạm: $KYHIEUTRAM</p>\r\n<p>- Lỗi quan trắc: $NHOMQUANTRAC</p>\r\n<p>- Lỗi: Trạm không truyền dữ liệu về</p>\r\n</br>\r\n<p>Đề nghị anh(chị) theo dõi và rà soát lại dữ liệu gửi về của trạm $TENTRAM</p>\r\n</br>\r\n<p>Trân trọng,</p>\r\n<p>$TRUNGTAM</p>'),
('9', '1', 'titleEmailAlertStructure', 'Cảnh báo file truyền về không đúng cấu trúc');