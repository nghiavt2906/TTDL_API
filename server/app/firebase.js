import HttpStatus from 'http-status-codes'
import models from "models";
import { newId } from 'models/utils'
import admin from "services/firebase"

class Firebase {
  constructor() {}

  addToken = async (citizenId, token) => {
    try {
      const citizens = await models.Citizen.findAll({
        where: { id: citizenId },
      });

      if (!citizens.length)
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.firebase.citizen_not_found",
          messages: "Not found citizen",
        };
      
      await models.FirebaseToken.create({id: newId(), citizenId, token})

    } catch (error) {
      throw error
    }
  };

  sendMessage = async (tokens, message) => {
    try {
      const payload = {
        data: {},
        notification: {
          body: message,
          title: 'Titile Message 2'
        },
        tokens
      } 
      const response = await admin.messaging().sendMulticast(payload)  
    } catch (error) {
      console.log(error)
      throw error
    }    
  }

  deleteToken = (citizenId, tokenDevice) => {
    return models.FirebaseToken.destroy({
      where: {
        citizenId : citizenId,
        token : tokenDevice
      }
    })
  }
}

export default Firebase