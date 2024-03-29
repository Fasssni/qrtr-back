const db = require("../Models");

class MessageService {
  async removeMessagesByConvId(conversation_id) {
    await db.message.destroy({
      where: {
        conversation_id,
      },
    });
  }

  async createMessage(user_id, text, name, conversation_id) {
    try {
      const message = await db.message.create({
        user_id,
        text,
        name,
        conversation_id,
      });

      return message;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new MessageService();
