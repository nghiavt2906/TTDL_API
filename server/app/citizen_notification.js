import models from "models";
class CitizenNotification {
  constructor() {}

  countUnread = async (citizenId) => {
    try {
      const result = await models.CitizenNotification.count({
        where: { receiverId: citizenId, isRead: false },
      });
      return result;
    } catch (error) {
      console.log(error)
      throw error;
    }
  };

  getNotifications = (citizenId, page, limit) => {
    return models.CitizenNotification.findAll({

      attributes: [
        [models.Sequelize.col('Notification.id'), 'id'],
        [models.Sequelize.col('Notification.content'), 'content'],
        [models.Sequelize.col('Notification.notiTime'), 'notiTime'],
        [models.Sequelize.col('Notification.type'), 'type'],
        'isRead' 
      ],
      where: {
        receiverId: citizenId
      },
      limit: limit,
      offset : page,
      include : [{
        model: models.Notification,
        attributes: [],

      }]
    })
  };
}

export default CitizenNotification;
