// import Client from 'ftp'
// import path from 'path'
// import fs from 'graceful-fs'
// import _ from 'lodash'
// import {analyze_FolderName} from 'src/utils/functions'
// import async from 'async'
// import chalk from 'chalk'
// import func from 'src/utils/functions'
// import moment from 'moment'
// import validator from 'validator'
// import {sendStructureMail, sendThresholdMail,sendDisconnectionMail } from 'src/utils/email'
// import sms from 'src/utils/sms'

const path = require('path');
// var fs = require('fs')
var fs = require('graceful-fs')
const _ = require('lodash')
const {analyze_FolderName} = require('../Utils/objectFunctions')
const db = require('../Database/queryDatabase')
const async = require('async')
const chalk = require('chalk')
const func = require('./objectFunctions')
const moment = require('moment')
const validator = require('validator')
const {sendStructureMail, sendThresholdMail,sendDisconnectionMail } = require('./sendEmail')
const sms = require('./sendSms')
import models from 'models'

var config = {
  // host: '192.168.1.29',
  host: '192.168.1.29',
  user: 'admin',
  password: 'quantracftp',
  port: 21
}
// var ftp = new Client();


module.exports = {
  kiemtra_Dulieuden : () => {
    var ftp = new Client();
    ftp.on('ready', () => {
      async.waterfall([ 
        function (callback) {
          let dir = './FTP'
          fs.readdir(dir, async(err,files)=> {
            if(err) console.log('Lỗi trong ham Dir')
            await Promise.all(files.map((file) => deleteFile(dir,file))).then(() => {
              callback(null,'success')
            }).catch((err) => {
              console.log(err)
            })
          })
        },
        function (result,callback){
          // console.log(chalk.yellow('----------------- Phase 1 -------------------'))
          let tenfileFtpKK = db.get_tenfileFTP('qtkk_tram',null)
          let tenfileFtpN = db.get_tenfileFTP('qtn_tram',null)
          let thongsoHethong = db.get_thamsoHethongFTP()
          let nguongchisoKHI = db.get_Nguongchiso('KHI',null,null)
          let nguongchisoNUO = db.get_Nguongchiso('NUO',null,null)
          Promise.all([tenfileFtpKK,tenfileFtpN,thongsoHethong,nguongchisoKHI,nguongchisoNUO]).then((result) => {
            callback(null,result)
          })
        },
        //Function1      
        function(dbInfo,callback) {
          
          let dbData = {}
          let nguongChiso = {}
          dbData.ftpKK = dbInfo[0]
          dbData.ftpN = dbInfo[1]
          dbData.thamsoHethong = dbInfo[2]
          nguongChiso.KHI = dbInfo[3][0]
          nguongChiso.NUO = dbInfo[4][0]
          //console.log(dbData.ftpKK[0] )
          // console.log(dbData.ftpN[0] )
          // console.log(dbData.thamsoHethong[0])
          // console.log(dbInfo[3])
          // console.log(dbInfo[4])
          fs.readdir('./FTP', (err, files) => {
            if (err) console.log('lỗi đây nek bác',err)
            // console.log(`Số file có trong thư mục FTP sau khi xóa: ${files.length}` )
          })

          let listArriveFolder = list_Folder(ftp,'/ArriveFiles','d')
          let listErrorFolder = list_Folder(ftp,'/ErrorFiles','d')
          let listDataFolder = list_Folder(ftp,'/DataFiles','d')
          let listFolder = Promise.all([listArriveFolder,listErrorFolder,listDataFolder])
          listFolder.then((result) => {
            let activeFolders = {}
            var khiArriveFolders = find_ActivedFolder(result[0], dbData.ftpKK[0], "KHI")
            var nuocArriveFolders = find_ActivedFolder(result[0], dbData.ftpN[0], "NUO")
            activeFolders.activeArriveFolders = _.concat(khiArriveFolders,nuocArriveFolders)

            activeFolders.activeErrorFolders = result[1]

            activeFolders.activeDataFolders = result[2]
            console.log(activeFolders)
            callback(null,activeFolders,dbData.thamsoHethong[0][0],nguongChiso)
          })
          // ftp.list('/ArriveFiles', (err, result) => {
          //   if(err){
          //     callback(err, null)
          //     return
          //   }
          //   // console.log(chalk.yellow(result))
          //   if(!result.length || result === undefined){
          //     ftp.end()
          //     callback(null, result)
          //     return
          //   }
          //   // console.log(result[1])
          //   // console.log(result[0])
          //   var khiFolders = find_ActivedFolder(result, dbData.ftpKK[0], "KHI")
          //   var nuocFolders = find_ActivedFolder(result, dbData.ftpN[0], "NUO")
          //   var activeFolders = _.concat(khiFolders,nuocFolders)
          //   // console.log({activeFolders})
          //   // console.log(chalk.yellow('----------------- Phase 2 -------------------'))
          //   callback(null,activeFolders,dbData.thamsoHethong[0][0],nguongChiso)
            
          // })
        },
        //Function2
        function(activeFolders, thamsoHethong, nguongChiso, callback) {
          let dataTram = []
          let tenTram = null
          let {activeArriveFolders,activeErrorFolders,activeDataFolders} = activeFolders
          // console.log({thamsoHethong})
          // console.log({nguongChiso})
          // console.log({activeArriveFolders,activeErrorFolders,activeDataFolders})
          activeArriveFolders.forEach((tramInfo) => {
              async.waterfall([
                //Subfunction1
                function(callback){
                  // console.log(chalk.blue('----------------- Sub Phase 3 - 1 -------------------'))
                  // console.log({tramInfo})
                  ftp.list(`/ArriveFiles/${tramInfo.folderName}`,(err,result) => {
                    let listFiles = []
                    if(err) {
                      console.log(chalk.red(err))
                      // callback(err,null)
                      return
                    }
                    // console.log({listfile : result})
                    if(result === undefined || !result.length ){
                      console.log(`Tramj ${tramInfo.folderName} không gửi dữ liệu về`)
                      var vietnamTimeNow = new Date().toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"});
                      var timeSubtract = Math.abs(new Date(vietnamTimeNow) - new Date(tramInfo.thoigianMoinhat))/60000
                      console.log(Math.abs(new Date(vietnamTimeNow) - new Date(tramInfo.thoigianMoinhat))/60000)
                      if(timeSubtract > 60){
                        if(tramInfo.solanGuiCBKhongtruyen === null){
                          tramInfo.solanGuiCBKhongtruyen = 0
                        }
                        if(thamsoHethong.trangthai_guiemail === 1 && tramInfo.trangthaiGuiKhongtruyen === 1 && tramInfo.solanGuiCBKhongtruyen < thamsoHethong.solan_guicanhbao){
                          let isSendCanhbao = false
                          if(thamsoHethong.trangthai_guiemail === 1){
                            sendDisconnectionMail((tramInfo))
                            isSendCanhbao = true
                          }
                          if(thamsoHethong.trangthai_guisms === 1){
                            sms.sendSmsDisconnection(tramInfo)
                            isSendCanhbao = true
                          }
                          if(isSendCanhbao){
                            let tenbang = return_TableName(tramInfo.type).bangTram
                            let solan = tramInfo.solanGuiCBKhongtruyen + 1
                            let queryUpdateSolanKhongtruyenDL = db.update_solanGuicanhbaoKhongtruyen(tenbang,solan,tramInfo.id_tram)
                            queryUpdateSolanKhongtruyenDL.then(() => {})
                          }
                        }
                      }
                      return
                    }
                    result.forEach(file => {
                      if(file.type === '-'){
                        listFiles = [...listFiles,file.name]
                      }
                    })
                    callback(null,listFiles)
                  })
                  
                },
                //Subfunction2
                function (result,callback){
                  // console.log(chalk.blue('----------------- Sub Phase 3 - 2 -------------------'))
                  async.map(result,(fileName,callback) => {
                    
                    let dir = `${thamsoHethong.directory_nhanftp}/${tramInfo.folderName}/${fileName}`
                    let file = analyze_TenFile(fileName)
                    let thongtinGuive = {}
                    
                    thongtinGuive.thoigian_guive = file.thoigian
                    
                    thongtinGuive.toado = null
                    thongtinGuive.dungluongpin = null
                    thongtinGuive.ftp_file = 1
                    thongtinGuive.loaiquantrac = tramInfo.type
                    thongtinGuive.id_tram = tramInfo.id_tram
                    // console.log({file})
                    ftp.get(dir, (err, streamData) => {
                      if(err) {
                        console.log('=========> error Here')
                        console.log(chalk.red(err))
                        return
                      }

                      if(streamData === undefined){
                        console.log(chalk.blue('Stream Data is undefined'))
                        return
                      }

                      let data = ''
                      streamData.on('data', (chunk) => {
                        data += chunk
                      }).on('end', async () => {
                        // let writeStream = fs.createWriteStream(`./FTP/${fileName}`);
                        // writeStream.write(data)
                        fs.writeFile(`./FTP/${fileName}`,data,err => {
                          console.log(err)
                        })
                        if(data === undefined){
                          console.log(chalk.red('DATA UNDIFINED'))
                          return
                        }
                        let tenbang = return_TableName(tramInfo.type).bangTram
                        /** Kiểm tra file gửi về có đúng cấu trúc hay không và gửi cảnh báo nếu file ko đúng cấu trúc */
                        let validateFileName = compare_Cautrucfile(fileName,tramInfo.tenfileFTP)
                        
                        // let validateContendFile = validate_noidungFile(data)
                        if(!validateFileName){
                          if(tramInfo.trangthaiGuiCautruc === 1 && tramInfo.solanGuiCBCautruc < thamsoHethong.solan_guicanhbao){
                            let isSendCanhbao = false
                            if(thamsoHethong.trangthai_guiemail === 1){
                              sendStructureMail(tramInfo)
                              isSendCanhbao = true
                            }
                            if(thamsoHethong.trangthai_guisms === 1){
                              sms.sendSmsWrongStructure(tramInfo)
                              isSendCanhbao = true
                            }
                            if(isSendCanhbao){
                              let solan = tramInfo.solanGuiCBCautruc + 1
                              let queryUpdateSolanSaiCautruc = db.update_solanGuicanhbaoCautruc(tenbang,solan,tramInfo.id_tram)
                              queryUpdateSolanSaiCautruc.then(() => {})
                            }
                          }                        
                        }
                        
                        thongtinGuive.noidungData = data
                        
                        // console.log(chalk.yellow('------------------------'))
                        // console.log(chalk.blue(thongtinGuive.noidungData))
                        let insertId = null
                        let finalData = split_Data(data)
                        // console.log({finalData})
                        // console.log({file})

                        /** Kiểm tra vượt ngưỡng và gửi cảnh báo */
                        let arrayNguongchiso = []
                        if(tramInfo.type === 'NUO') {
                          arrayNguongchiso = nguongChiso.NUO
                        } else {
                          arrayNguongchiso = nguongChiso.KHI
                        }
                        let ketquaVuotnguong = finalData.map((data) => {
                          let index = _.findIndex(arrayNguongchiso,{kyhieu: data.tenchiso, id_nhomquantrac: 2})
                          if(index < 0) return
                          let ketqua = parseFloat(data.ketqua)
                          let chiso_duoi = parseFloat(arrayNguongchiso[index].chiso_duoi)
                          let chiso_tren = parseFloat(arrayNguongchiso[index].chiso_tren)   
                          //let tenbang = return_TableName(tramInfo.type).bangTram     
                          // console.log('=====================================')
                              // console.log({tramInfo,data},arrayNguongchiso[index])                 
                          if(ketqua < chiso_duoi || ketqua > chiso_tren){
                            let solanVN = tramInfo.solanVuotnguong + 1
                            let queryUpdateSolanVuotnguong = db.update_solanVuotnguong(tenbang,solanVN,tramInfo.id_tram)
                            queryUpdateSolanVuotnguong.then(() => {})
                            
                            if(tramInfo.trangthaiGuiVuotnguong === 1 && tramInfo.solanVuotnguong >= thamsoHethong.thongso_vncmot && tramInfo.solanGuiCBVuotnguong < thamsoHethong.solan_guicanhbao){
                              let isSendCanhbao = false
                            if(thamsoHethong.trangthai_guiemail === 1){
                              sendThresholdMail(tramInfo,data,arrayNguongchiso[index])
                              isSendCanhbao = true
                              }
                            if(thamsoHethong.trangthai_guisms === 1){
                              sms.sendSmsThreshold(tramInfo,data,arrayNguongchiso[index])
                              isSendCanhbao = true
                              }
                            if(isSendCanhbao){
                              let solan = tramInfo.solanGuiCBVuotnguong + 1
                              let queryUpdatSolanGuiCBVuotnguong = db.update_solanGuicanhbaoVuotnguong(tenbang,solan,tramInfo.id_tram)
                              queryUpdatSolanGuiCBVuotnguong.then(() => {})
                              }
                            }
                            return true
                          } else {
                            return false
                          }
                          
                        })
                        // console.log(chalk.green(ketquaVuotnguong))
                        if(!ketquaVuotnguong.includes(true)){
                          let queryUpdateAntoan = db.update_quantracAntoan(tenbang,tramInfo.id_tram)
                          queryUpdateAntoan.then(() => {})
                        }
                        let thongtinDulieu = get_ThongtinDulieu(thongtinGuive)

                        let queryThongtinsolieu = db.insert_Thongtindulieu(thongtinDulieu)
                        await queryThongtinsolieu.then((result) => {
                          // console.log({resultThongtinsolieu: result})
                          insertId = result[0].insertId
                        }).catch((err) => {
                          console.log(chalk.yellow(err))
                        })

                        if(insertId === null){
                          return
                        }

                        let queryDulieuchiso = db.insert_Solieuquantrac(thongtinDulieu.tenbangDulieu,insertId,finalData)
                        queryDulieuchiso.then((result) => {
                          // console.log(chalk.red(result))
                        }).catch((err) => {
                          console.log(err)
                        })

                        let queryUpdateThoigianmoinhat = db.update_thoigianMoinhat(thongtinDulieu.tenbangTram, thongtinDulieu.thoigian_guive, thongtinDulieu.id_tram)
                        queryUpdateThoigianmoinhat.then(()=> {})

                        let indexFolder = find_arrayIndex(activeErrorFolders, tramInfo.folderName)
                        if(indexFolder < 0) {
                          // let mkdirTramFolder =  mkdir_Ftp(ftp,`./ErrorFiles/${tramInfo.folderName}`)
                          console.log(`Khong có thư mục`)
                          let mkdirTramFolder =  mkdir_Ftp(ftp,'./ErrorFiles/NUOPHUOCLY')
                          await mkdirTramFolder.then(() => {
                            console.log(`Đã tạo thư mục ${tramInfo.folderName}`)
                          }).catch(err => {
                            console.log(err)
                          })
                        }
                        console.log('O day nek')
                        let listDataFolderTram = list_Folder(ftp,`./DataFiles`,'d')
                        listDataFolderTram.then((result) => {
                          console.log(result)
                        }).catch(err => {
                          console.log(err)
                        })
                        // console.log({listDataFolderTram})
                        // let indexLoaiquantrac = find_arrayIndex()



                        // console.log(chalk.yellow(tramInfo.folderName))
                      })
                                     
                    })
                  })
                  // console.log(chalk.yellow('----------------- Phase 3 -------------------'))
                  callback(null,1)
                }
              ], (err,result) => {
                // console.log('==============> Kết quả sub function 2')
                if(err) {
                  console.log(err)
                }
              })
          })
          callback(null,'i++')
        },

      ], (err, result) => {
        // console.log('===================> Kết quả hàm tổng')
        if(err) {
          // console.log(err)
          ftp.end()
          return
        }
        // console.log(result)
        ftp.end()   
      })
    })
    ftp.connect(config)
    
  },
  testFile
}

/*
* Description: Hàm này để chuyển các giá trị QT trong array of arrays thành array of objects
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {array} data : Array của các array data VD: data = [ ['﻿PH', '7.657', '', '20190929130707', '00\r' ],..]
*
* return {array} array of objects data 
* VD: [{tenchiso: "PH" ,
* ketqua: "7.657" ,
* donvi: "" ,
* thoigian: "20190929130707" ,
* trangthaiSensor: "00},...]
*/
function convert_ArrayToObject(data){
  return data.map(smalldata => {
    let newData = {}

    // Kiểm tra dữ liệu thuộc form cũ hay form mới
    if(smalldata.length > 4){
      newData.tenchiso = smalldata[0].replace('﻿','')
      newData.ketqua = smalldata[1]
      newData.donvi = smalldata[2]
      newData.thoigian = smalldata[3]
      newData.trangthaiSensor = smalldata[4].replace('\r','')
    } else {
      newData.tenchiso = smalldata[1].replace('﻿','')
      newData.ketqua = smalldata[2]
      newData.donvi = smalldata[3].replace('\r','')
      newData.thoigian = smalldata[0]
      newData.trangthaiSensor = '01'
    }
    return newData
  })
}

/*
* Description: Chuyển string dữ liệu trong file ftp và chuyển thành các object data
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {string} data : string data trong file dữ liệu
* @param {boolean} isNewDulieu : xác nhận string data này thuộc form cũ hay form mới
*
* return {array} array of objects data 
* VD: [{tenchiso: "PH" ,
* ketqua: "7.657" ,
* donvi: "" ,
* thoigian: "20190929130707" ,
* trangthaiSensor: "00},...]
*/
function split_Data (data) {
  let dataArray = []
  data = _.split(data,'\n')

  //Cắt string data thành các mảng array 
  data.forEach((smallData) => {
    smallData = _.split(smallData,'\t')
    if(smallData.length >= 4){
      dataArray.push(smallData)
    }
  })

  //Chuyển array dữ liệu thành các object dữ liệu
  return convert_ArrayToObject(dataArray)
}

function get_ThongtinDulieu(thongtinGuive){
  let thongtinSolieu = {...thongtinGuive}
  let datetime = func.convertTimeToISOFormat(thongtinGuive.thoigian_guive)
  // console.log(datetime)
  if(thongtinGuive.solan_guicanhbaokhongtruyen === null){
    thongtinSolieu.solan_guicanhbaokhongtruyen = 0
  }
  if(thongtinGuive.loaiquantrac === 'NUO'){
    thongtinSolieu.tenbang = 'qtn_solieu'
    thongtinSolieu.tenbangDulieu = 'qtn_solieuchiso'
    thongtinSolieu.tenbangTram = 'qtn_tram'
  } else {
    thongtinSolieu.tenbang = 'qtkk_solieu'
    thongtinSolieu.tenbangDulieu = 'qtkk_solieuchiso'
    thongtinSolieu.tenbangTram = 'qtkk_tram'
  }
  thongtinSolieu.ngay_guive = moment(datetime).format('YYYY-MM-DD')
  thongtinSolieu.gio_guive = moment(datetime).format('HH:mm:ss')
  thongtinSolieu.thoigian_guive = moment(datetime).format('YYYY-MM-DD HH:mm:ss')
  
  return thongtinSolieu
  // console.log({thongtinBang: thongtinSolieu})
}


/*
* Description: Hàm này để tách tên file ra thành tên file, thời gian gửi về, loại file
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {string} tenfile : String tên file ví dụ "DNa_CENT_NUOHDX_20170929121212.txt"
*
* return {object} file gồm loại file, thời gian gửi về và tên file
*/
function analyze_TenFile (tenfile) {
  var file = {}
  var cautrucFile = _.split(tenfile,'.')
  var splittingFile = _.split(cautrucFile[0],'_')

  file.loaiFile = cautrucFile[1]
  if(splittingFile.length > 3){
    file.kyhieuTram = splittingFile[2]
    file.thoigian = splittingFile[3]
    file.tenFile = _.split(cautrucFile[0],file.thoigian )[0]
  } else {
    file.kyhieuTram = splittingFile[0]
    file.thoigian = splittingFile[1]
    file.tenFile = cautrucFile[0].replace(file.thoigian,'')
  }

  return file
}

/*
* Description: Hàm này để tìm các folder có trùng tên FTP với các trạm có trangthai_nhanFTP = 1 hay không
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {array} folderFTP : array chứa thông tin của các thư mục trong thư mục nhận file
* @param {array} ftpDB : array chứa thông tin FTP của các trạm đang hoạt động
* @param {string} type : Type của loại quan trắc 
*
* return {array} gồm [{folderName : "KHILEDUAN", type: "KHI"},...]
*/
function find_ActivedFolder (folderFTP, ftpDB, type){
  let activedFolder = []
  ftpDB.forEach(ftpTram => {
    let index = _.findIndex(folderFTP, (folder) => {
      return folder === ftpTram.thumuc_ftp
    })
    if(index > -1){
      let tramDir = {}
      tramDir.folderName = folderFTP[index]
      tramDir.id_tram = ftpTram.id
      tramDir.tenTram = ftpTram.ten_tram
      tramDir.tenfileFTP = ftpTram.tenfile_ftp
      tramDir.diachi = ftpTram.diachi
      tramDir.kyhieu = ftpTram.kyhieu
      tramDir.nhomquantrac = ftpTram.ten_nhomquantrac
      tramDir.type = type
      if(type === 'KHI'){
        tramDir.loaiquantrac = 'khi'
      } else {
        tramDir.loaiquantrac = 'nuoc'
      }
      tramDir.thoigianMoinhat = ftpTram.thoigianmoinhat
      tramDir.solanVuotnguong = ftpTram.solan_vuotnguong
      tramDir.solanGuiCBVuotnguong = ftpTram.solan_guicanhbaovuotnguong
      tramDir.solanGuiCBCautruc = ftpTram.solan_guicanhbaocautruc
      tramDir.solanGuiCBKhongtruyen = ftpTram.solan_guicanhbaokhongtruyen
      tramDir.trangthaiGuiVuotnguong = ftpTram.trangthai_guicanhbaovuotnguong
      tramDir.trangthaiGuiCautruc = ftpTram.trangthai_guicanhbaocautruc
      tramDir.trangthaiGuiKhongtruyen = ftpTram.trangthai_guicanhbaokhongtruyen

      activedFolder.push(tramDir)
    }  
  })
  return activedFolder
}


/*
  * Description: Hàm này để so sánh file gửi về và file mặc định trong DB có giống không
  * Writer: Đỗ Hữu Tín (06/09/2019)
  *
  * @param {string} tenFileGuive : String tên file ví dụ "DNa_CENT_NUOHDX_20170929121212.txt"
  * @param {string} tenFileMacdinh : String tên file ví dụ "DNa_CENT_NUOHDX_yyyyMMddhhmmss.txt"
  *
  * return {bolean} true nếu file gửi về giống với mặc định
  */
function compare_Cautrucfile (tenFileGuive, tenFileMacdinh) {
  var fileGuive = analyze_TenFile(tenFileGuive)
  var fileMacdinh = analyze_TenFile(tenFileMacdinh)
  // console.log({fileGuive,fileMacdinh})
  if(fileGuive.loaiFile !== 'txt' || fileGuive.tenFile !== fileMacdinh.tenFile || !validate_Thoigian(fileGuive.thoigian)){
    return false
  }
  return true
}

/*
* Description: Hàm này để validate thời gian gửi về có đúng không
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {string} thoigian : String thời gian ví dụ "20190912010203"
*
* return {boolean} true/false
*/
function validate_Thoigian (thoigian) {
  if(!validator.isNumeric(thoigian) || thoigian.length !== 14){
    return false
  }
  var year = parseInt(thoigian.substr(0,4))
  var month = parseInt(thoigian.substr(4,2))
  var day = parseInt(thoigian.substr(6,2))
  var hour = parseInt(thoigian.substr(8,2))
  var min = parseInt(thoigian.substr(10,2))
  var sec = parseInt(thoigian.substr(12,2))
  if(year < 2019 || month > 12 || day > 31){
    return false
  }
  if(hour > 24 || min > 60 || sec > 60){
    return false
  }
  return true
}

/*
* Description: Hàm này để validate nội dung của file ftp gửi về có đúng cấu trúc không.
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {array} noidung : Array dữ liệu quan trắc
*
* Kết quả trả về false nếu:
* - Kết quả quan trắc không phải là số
* - Thời gian gửi về không hợp lệ
* - Trạng thái của sensor bị sai quy định
* Kết quả gửi về true nếu validate thành công
*/
function validate_noidungFile (noidung) {
  return noidung.every((dataChiso) => {
    if(!validator.isNumeric(dataChiso.ketqua) || !validate_Thoigian(dataChiso.thoigian) || _.indexOf(['00','01','02'],dataChiso.trangthaiSensor) < 0) {
      return false
    }
    return true
  })
}

function deleteFile (dir,file){
  return new Promise((resolve,reject) => {
    fs.unlink(path.join(dir,file), err => {
      if(err) reject(err)
      // console.log({file})
      resolve()
    })
  })
}

function testFile (){
  let dir = './FTP'
  fs.readdir(dir, async(err,files)=> {
    if(err) console.log('Lỗi trong ham Dir')
    await Promise.all(files.map((file) => deleteFile(dir,file))).then(() => {
      console.log('abc')
    }).catch((err) => {
      console.log(err)
    })

    // writeFile function with filename, content and callback function

    let arrayName = [Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100)]
    arrayName.map((item) => {
      fs.writeFile(`./FTP/$${item}.txt`, 'Learn Node FS module', function (err) {
      if (err) throw err;
      console.log('File is created successfully.');
    })
  }); 
  })
}

function return_TableName (type) {
  let dbTable = {}
  if(type === 'NUO'){
    dbTable.bangTram = 'qtn_tram'
  } else {
    dbTable.bangTram = 'qtkk_tram'
  }
  return dbTable
}


function list_Folder (ftp, folderDir, type){
  return new Promise((resolve,reject) => {
    ftp.list(folderDir,(err,result) => {
      if(err) reject(err)
      let listFiles = []
      result.forEach((folder) => {
        if(folder.type === type){
          listFiles.push(folder.name)
        }
      })
      resolve(listFiles)
    })
  })
}

function put_FileFTP (ftp, content, destDir) {
  return new Promise ((resolve,reject) => {
    ftp.put(content, destDir, err => {
      if(err) reject(err)
      resolve()
    })
  })
}

function mkdir_Ftp (ftp, dir) {
  return new Promise ((resolve,reject) => {
    ftp.mkdir(dir, err => {
      if(err) reject(err)
      console.log('Có vào function mkdir')
      resolve()
    })
  })
}

function find_arrayIndex (array,stringCondition){
  return _.findIndex(array,(element) => {
    return element === stringCondition
  })
}

function analyze_Thoigian (thoigian) {
  let timeReceive = {}
  timeReceive.year = `${thoigian.substr(0,4)}`
  timeReceive.thang = `Thang${thoigian.substr(4,2)}`
  timeReceive.ngay = `${thoigian.substr(6,2)}${thoigian.substr(4,2)}${thoigian.substr(0,4)}`
  return timeReceive
}