import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"
import { newId, generateToken } from "models/utils"
import app from "app"
import config from "configs";

class News {
  constructor() {}

  async getNews(offset, limit) {
    let news = await models.News.findAll({
      where: {status : true},
      attributes : ['id','title','image','publishDate'],
      offset: offset,
      limit : limit,
      order : [['publishDate', 'DESC']]
    })
    return news
  }

  async getLatestNews() {
    let news = await models.News.findAll({
      where : {status: true},
      attributes : ['id','title','image', 'imageDesc', 'description', 'body','publishDate'],
      order: [['publishDate', 'DESC']],
      limit : 1
    })
    return news
  }

  async getContentNews(newsId) {
    let news = await models.News.findAll({
      attributes : ['id','title','image', 'imageDesc', 'description', 'body','publishDate', 'link'],
      where : {
        id : newsId,
        status : true
      }
    })
    return news
  }

  async getNewsInfo () {
    return models.News.findAll({
      raw: true,
      attributes : [
        'id','creatorId', 'title','image', 'imageDesc', 'description', 'body','publishDate', 'status',
        [models.Sequelize.col('Manager.name'), 'creatorName'],
    ],
      include : [{ model: models.Manager, attributes: [], required: true }]
    })
  }

  async getNewsInfoById (newsId) {
    return models.News.findAll({
      raw: true,
      where: { id: newsId},
      attributes : [
        'id','creatorId', 'title','image', 'imageDesc', 'description', 'body','publishDate', 'status',
        [models.Sequelize.col('Manager.name'), 'creatorName'],
    ],
      include : [{ model: models.Manager, attributes: [], required: true }]
    })
  }

  async deleteNews (newsId) {
    return models.News.destroy({
      where : {
        id: newsId
      }
    })
  }

  async updateNews (newsId, data) {
    if(data.image === "" || data.image === null){
      data.image = `http://${config.server.host}/api/file/default.jpg`
    } else {
      if(data.image.includes(config.server.host)){
        data.image = data.image
      } else {
        data.image = `http://${config.server.host}/api/file/${data.image}`
      }
    }
    await models.News.update({
      title: data.title,
      image: data.image,
      imageDesc: data.imageDesc,
      description: data.description,
      body: data.body,
      publishDate: data.publishDate,
      status: data.status
    },{
      where: {
        id: newsId
      }
    })
    return this.getNewsInfoById(newsId)
  }

  async createNews (data) {
    if(data.image === undefined || data.image === null){
      data.image = `http://${config.server.host}/api/file/default.jpg`
    } else {
      data.image = `http://${config.server.host}/api/file/${data.image}`
    }
    let result = await models.News.create({
      id: newId(),
      creatorId: data.creatorId,
      title: data.title,
      image: data.image,
      imageDesc: data.imageDesc,
      description: data.description,
      body: data.body,
      publishDate: data.publishDate,
      status: data.status,
      numberReads: 0
    })
    return this.getNewsInfoById(result.id)
  }
}

export default News
