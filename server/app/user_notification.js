import models from "models";
class UserNotification {
  constructor() {}

  countUnread = async (userId) => {
    try {
      const result = await models.UserNotification.count({
        where: { receiverId: userId, isRead: 0 },
      });

      return result
    } catch (error) {
      throw error
    }
  };

  getNotification = async (userId) => {

  };
}

export default UserNotification
