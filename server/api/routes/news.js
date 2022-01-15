import { Router } from "express"
import models from 'models'
import * as func from "utils/functions"
const router = Router()
import bodyParser from 'body-parser'
import app from "app"
import url from "url"

// import {getFilterStationMobile, getFilterStationByTypeMobile, getFilterStationByGroupMobile} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/tintuc", router)

  router.get("/", async (req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    // console.log("========>", fullUrl, req.protocol + '://' + req.get('host'))
    let data = {}
    let {offset, limit} = req.query
    // console.log(offset, limit)
    if(offset === undefined || limit === undefined){
      offset = 1
      limit = 10
    } else {
      offset = parseInt(offset)
      limit = parseInt(limit)
    }
    let latestNews = await app.News.getLatestNews()
    let news = await app.News.getNews(offset,limit)
    data.latestNews = latestNews
    data.news = news
    res.send(data)
  })

  router.get("/getNews", async (req, res, next) => {
    let data = {}
    let {offset, limit} = req.query
    // console.log(offset, limit, typeof offset)
    let news = await app.News.getNews(parseInt(offset), parseInt(limit))
    res.json(news)
  })

  router.get("/getContentNews/:newsId", async (req, res, next) => {
    let data = {}
    let {newsId} = req.params
    let news = await app.News.getContentNews(newsId)
    res.json(news)
  })

  router.get("/getInfo/:managerId", async (req, res, next) => {
    try {
      const result = await app.News.getNewsInfo()
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  // router.delete("/:managerId/:newsId", async (req, res, next) => {
  //   try {
  //     const {newsId} = req.params

  //     await app.News.deleteNews(newsId)
  //     res.sendStatus(200)
  //   } catch (error) {
  //     console.log(error)
  //     next(error)
  //   }
  // })

  router.delete("/:managerId/:newsId", async (req, res, next) => {
    try {
      const {managerId, newsId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_notification')

      await app.News.deleteNews(newsId)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/:managerId/:newsId", async (req, res, next) => {
    try {
      const {managerId, newsId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_notification')

      const data = req.body
      // console.log({data})
      const result = await app.News.updateNews(newsId, data)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/:managerId", async (req, res, next) => {
    try {
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_notification')
      
      const data = req.body
      data.creatorId = managerId
      // console.log({data})
      const result = await app.News.createNews(data)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
  
}
