const db = require("../Models");
const { removeMessagesByConvId } = require("../Services/MessageService");

class ConversationsService {
  async getConversations(user_id) {
    try {
      const conversations = await db.conversations.findAll({
        where: {
          user_id: user_id,
        },
      });
      return conversations;
    } catch (e) {
      throw new Error("Error fetching conversations");
    }
  }

  async getUserChat(user_id, conversationId) {
    try {
      const chat = await db.message.findAll({
        where: {
          conversation_id: conversationId,
          user_id: user_id,
        },
      });
      return chat;
    } catch (e) {
      throw new Error("Error fetching user chat");
    }
  }

  async clearChat(conv_id) {
    try {
      await db.message.destroy({
        where: {
          conversation_id: conv_id,
        },
      });
      return "The chat has been cleared!";
    } catch (e) {
      throw new Error("Error clearing chat");
    }
  }

  async removeChat(conv_id) {
    try {
      await db.message.destroy({
        where: {
          conversation_id: conv_id,
        },
      });

      await db.conversations.destroy({
        where: {
          id: conv_id,
        },
      });
      return "Success";
    } catch (e) {
      throw new Error("Error removing chat");
    }
  }
  async removeChatByBotId(bot_id) {
    try {
      const chats = await db.conversations.findAll({
        where: {
          bot_id,
        },
      });
      chats.forEach(async (chat) => {
        await removeMessagesByConvId(chat.id);
      });
      await db.conversations.destroy({
        where: {
          bot_id: bot_id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
  async findChatByIds(message, botdb) {
    const chat = await db.conversations.findOne({
      where: {
        to_id: message.from.id,
        bot_id: botdb.id,
      },
    });
    return chat;
  }
}

module.exports = new ConversationsService();
