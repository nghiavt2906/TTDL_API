import { Router } from "express"
import { isEmail, isEmpty } from "validator"
import _ from "lodash"
import app from 'app'
import * as func from "utils/functions"
const router = Router()

export default expressRouter => {
  expressRouter.use('/roles', router)

  router.get('/:userId', async (req, res, next) => {
    try {
      const userId = req.params.userId
      let result = await app.Role.getLowerPriorityRole(userId)
      result = func.changeToArrayFilter(result, 'id', 'displayName')
      res.json(result)
    } catch (error) {
      console.log(error)
  next(error)      
    }
  })
}