import models from "models"
import { newId } from "models/utils"
import app from 'app'
import HttpStatus from "http-status-codes"
import moment from 'moment'

class ActivityLog {
  constructor(){}

  async createActivityLog (managerId, activityType, dataType, handleAt, dataId) {
    return models.ActivityLog.create({
      id : newId(),
      managerId, activityType, dataType, handleAt, dataId
    })
  }

  logAporoveData (managerId, arrDataId) {
    const timeNow = moment().utc(7).format()
    const data = arrDataId.map(item => {
      return {
        id: newId(),
        managerId,
        activityType: 'APPROVE',
        dataType: 'DATA',
        handleAt: timeNow,
        dataId: item
      }
    })
    return models.ActivityLog.bulkCreate(data)
  }

  logCancelAporoveData (managerId, arrDataId) {
    const timeNow = moment().utc(7).format()
    const data = arrDataId.map(item => {
      return {
        id: newId(),
        managerId,
        activityType: 'UNAPPROVE',
        dataType: 'DATA',
        handleAt: timeNow,
        dataId: item
      }
    })
    return models.ActivityLog.bulkCreate(data)
  }
}

export default ActivityLog