const db = require("../Models");
const { Sequelize, Op } = require("sequelize");

class InterfaceService {
  async getChannels(id) {
    const channels = await db.botToken.findAll({
      where: {
        user_id: id,
      },
    });
    return channels;
  }

  async findClientByName(q) {
    const users = await db.conversations.findAll({
      where: {
        client_name: {
          [db.Sequelize.Op.like]: `%${q}%`,
        },
      },
    });
    return users;
  }
}

module.exports = new InterfaceService();
