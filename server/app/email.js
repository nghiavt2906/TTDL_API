import nodemailer from "nodemailer"
import app from "app"
import { reformatSystemInfo } from "./utils"



export default class Email {
  constructor() {}

  getReceiverByPermission = async (permission) => {
    const result = await app.Character.getCharacterListByPermission(permission)
    const idList = result.map((item) => item.id)
    const managerList = await app.Manager.getManagerByCharacterId(idList)
    if(managerList.length > 0){
      let emailList = ''
      for(let item of managerList){
        emailList = item.email + '; ' + emailList
      }
      return emailList
    } else {
      return null
    }
  }


  sendMail = async (mailInfo) => {
    try {
      let serverEmail = await app.System.findSystemInfo("1", [
        "mailServername",
        "mailServer",
        "mailPassword"
      ])
      serverEmail = reformatSystemInfo(serverEmail)
      const  {mailServername, mailServer, mailPassword } = serverEmail
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: mailServer,
          pass: mailPassword,
        },
      })

      const mailOptions = {
        from: `${mailServername} <${mailServer}>`,
        to: mailInfo.receiver,
        subject: mailInfo.subject,
        html: mailInfo.content,
      }

      await transporter.sendMail(mailOptions)
    } catch (err) {
      console.log(err)
      // throw err
    }
  }
}
