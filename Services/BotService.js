const TelegramApi = require("node-telegram-bot-api");
const db = require("../Models");

const { removeChatByBotId } = require("../Services/ConversationService");
const { deleteTemplateByBotId } = require("../Services/TemplateService");
class BotService {
  async createBotInstance(user_id, token) {
    const isToken = await db.botToken.findOne({
      where: {
        token: token,
      },
    });

    if (isToken) {
      throw new Error("The Bot has already been connected");
    } else {
      const newBot = new TelegramApi(token, { polling: false });
      const { username } = await newBot.getMe();
      const botToken = await db.botToken.create({
        token: token,
        user_id: user_id,
        name: username,
      });

      return botToken;
    }
  }
  async startBots() {
    try {
      const botsDB = await db.botToken.findAll();
      const botsTG = botsDB.map(
        (bot) => new TelegramApi(bot.token, { polling: true })
      );
      return { botsDB, botsTG };
    } catch (e) {
      throw new Error("Error starting bots");
    }
  }

  async deleteBot(id) {
    try {
      await removeChatByBotId(id);
      await deleteTemplateByBotId(id);
      const deletedBot = await db.botToken.destroy({
        where: {
          id: id,
        },
      });

      return deletedBot;
    } catch (e) {
      console.log(e);
    }
  }

  async getBotById(id) {
    try {
      const bot = await db.botToken.findOne({
        where: {
          id: id,
        },
      });
      return bot;
    } catch (e) {}
  }

  async findBotByToken(token) {
    try {
      const bot = await db.botToken.findOne({
        where: {
          token: token,
        },
      });
      return bot;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new BotService();
