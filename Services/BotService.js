const TelegramApi = require("node-telegram-bot-api"); 
const db = require("../Models")
 

class BotService {
    async createBotInstance(user_id, token) {
      const isToken = await db.botToken.findOne({
        where: {
          token: token
        }
      });
  
      if (isToken) {
         throw new Error("The Bot has already been connected");
      } else {
        const newBot = new TelegramApi(token, { polling: true });
        const { username } = await newBot.getMe();
        await newBot.stopPolling({
            cancel:true
        });
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
          const botsTG = botsDB.map((bot) => new TelegramApi(bot.token, { polling: true }));
          return { botsDB, botsTG };
        } catch (e) {
          throw new Error("Error starting bots");
        }
      }
    }
    
module.exports = new BotService();
    