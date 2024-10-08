const TelegramApi = require("node-telegram-bot-api");

const db = require("../Models");
const wss = require("../WebSockets/websocket");

const BotService = require("../Services/BotService");
const { createMessage } = require("../Services/MessageService");
const InterfaceService = require("../Services/InterfaceService");
const { InstanceError } = require("sequelize");
const ConversationService = require("../Services/ConversationService");
const { checkAuth } = require("./userController");
const { startAutomations } = require("./botControllers");
const TemplateService = require("../Services/TemplateService");

const { Sequelize, Op } = require("sequelize");
const { checkauth } = require("../Services/UserService");

let botInstance = null;

const createBotInstance = async (req, res) => {
  try {
    const { user_id } = req.query;
    const { token, greeting } = req.body;

    const botToken = await BotService.createBotInstance(user_id, token);
    if (greeting) {
      const greetingTemplate = await TemplateService.createTemplate({
        bot_id: botToken.id,
        name: "greeting",
        triggersTo: "/start",
        text: greeting,
      });
    }

    await catchMessage();
    return res.status(201).json(botToken);
  } catch (e) {
    res.status(500).json(e);
  }
};

const startBots = async () => {
  try {
    if (!botInstance) {
      const botsDB = await db.botToken.findAll();
      const botsTG = botsDB.map(
        (bot) => new TelegramApi(bot.token, { polling: true })
      );
      botInstance = { botsDB, botsTG };
    } else {
      const botsDB = await db.botToken.findAll();
      const newBotsDB = botsDB.filter((dbBot) =>
        botInstance.botsDB.every((instanceBot) => instanceBot.id !== dbBot.id)
      );

      const newBotsTG = newBotsDB.map(
        (newBot) => new TelegramApi(newBot.token, { polling: true })
      );
      botInstance = {
        botsDB: [...botInstance.botsDB, ...newBotsDB],
        botsTG: [...botInstance.botsTG, ...newBotsTG],
      };
    }
    return botInstance;
  } catch (e) {
    console.log(e);
  }
};

const catchMessage = async () => {
  const { botsTG } = await startBots();
  try {
    botsTG.forEach((bot) => {
      bot.on("message", async (message) => {
        const botdb = await BotService.findBotByToken(bot.token);

        const isConversation = await ConversationService.findChatByIds(
          message,
          botdb
        );

        if (isConversation) {
          const data = await createMessage(
            message.from.id,
            message.text,
            message.from.first_name,
            isConversation.id
          );
          await startAutomations({
            bot_id: botdb.id,
            bot,
            message,
            user_id: isConversation.user_id,
            conversation_id: isConversation.id,
          });
          socketMessageHandler(data);
        } else {
          const imageUrl = await getUserPhoto(message.from.id, bot);

          const conversation = await db.conversations.create({
            user_id: botdb.user_id,
            to_id: message.from.id,
            client_name: message.from.first_name,
            user_pic: imageUrl || undefined,
            bot_id: botdb.id,
            bot_name: botdb.name,
            channel: "telegram",
          });
          const data = await db.message.create({
            user_id: message.from.id,
            text: message.text,
            name: message.from.first_name,
            conversation_id: conversation.id,
          });

          await startAutomations({
            bot_id: botdb.id,
            bot,
            message,
            user_id: conversation.user_id,
            conversation_id: conversation.id,
          });
          socketConvHandler(conversation, botdb.user_id);
          socketMessageHandler(data);
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { user_id, text, name, to_id } = req.body;
    const { botsTG, botsDB } = botInstance;
    const conversation = await db.conversations.findOne({
      where: {
        id: id,
      },
    });

    const botdb = botsDB.find((item) => item.id === conversation.bot_id);
    const bot = botsTG.find((item) => item.token === botdb.token);
    const message = await bot.sendMessage(to_id, text);
    const data = await createMessage(user_id, text, name, id);
    res.status(200).json(data);
    socketMessageHandler(data);
  } catch (e) {
    console.log(e);
    res.status(501).json(e.message);
  }
};

const socketConvHandler = (value, user_id) => {
  wss.clients.forEach((client) => {
    if (client.id === user_id) {
      client.send(
        JSON.stringify({ method: "new-conversation", message: value })
      );
    }
  });
};

const socketMessageHandler = async (value) => {
  console.log("the socket has been called");
  const conversation = await db.conversations.findAll({
    where: {
      id: value.conversation_id,
    },
  });

  try {
    wss.clients.forEach((client) => {
      if (client.id === conversation.user_id) {
        console.log("its' been here ");
        client.send(JSON.stringify({ method: "message", message: value }));
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const getUserPhoto = async (client_id, bot) => {
  try {
    const profile = await bot.getUserProfilePhotos(client_id, { limit: 1 });

    const profilePic = profile.photos;
    console.log(profilePic, "profile pic");

    if (profilePic.length > 0) {
      const file_id = profilePic[0][0]?.file_id;
      const getFileUrl = `https://api.telegram.org/bot${bot.token}/getFile?file_id=${file_id}`;

      const urlResponse = await fetch(getFileUrl);

      if (urlResponse.ok) {
        const fileInfo = await urlResponse.json();

        if (fileInfo.ok) {
          const imageUrl = `https://api.telegram.org/file/bot${bot.token}/${fileInfo.result.file_path}`;
          console.log(imageUrl);
          return imageUrl;
        } else {
          console.error("Error getting file information:", fileInfo);
        }
      } else {
        console.error("Error fetching URL:", urlResponse.statusText);
      }
    } else {
      console.error("No profile picture available.");
    }
  } catch (e) {
    console.error("Error:", e);
  }
};

const getMessages = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(403).json("Unauthorized");
    }
    const user = await checkauth(token);
    const messages = await db.message.findAll({
      where: {
        user_id: user.id,
      },
    });
    res.status(200).json(messages);
  } catch (e) {
    console.error(e);
    res.status(e.message === "Unauthorized" ? 403 : 500).json(e.message);
  }
};

const getConversations = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(403).json("Unauthorized");
    }
    const user = await checkauth(token);

    const conversations = await db.conversations.findAll({
      where: { user_id: user.id },
    });

    const conversationIds = conversations.map((convo) => convo.id);

    const lastMessageSubquery = await db.message.findAll({
      attributes: [
        [Sequelize.fn("MAX", Sequelize.col("id")), "lastMessageId"],
        "conversation_id",
      ],
      where: {
        conversation_id: {
          [Op.in]: conversationIds,
        },
      },
      group: ["conversation_id"],
      raw: true,
    });

    const lastMessageIds = lastMessageSubquery.map((row) => row.lastMessageId);

    const lastMessages = await db.message.findAll({
      where: {
        id: {
          [Op.in]: lastMessageIds,
        },
      },
      raw: true,
    });

    const result = conversations.map((conversation) => {
      const lastMessage = lastMessages.find(
        (message) => message.conversation_id === conversation.id
      );
      return {
        ...conversation.toJSON(),
        lastMessage: lastMessage ? lastMessage : null,
      };
    });

    const sortedResult = result.sort((a, b) => {
      const dateA = a.lastMessage
        ? new Date(a.lastMessage.createdAt)
        : new Date(0);
      const dateB = b.lastMessage
        ? new Date(b.lastMessage.createdAt)
        : new Date(0);
      return dateB - dateA;
    });

    res.status(200).json(sortedResult);
  } catch (e) {
    res.status(e.message === "Unauthorized" ? 403 : 500).json(e.message);
  }
};
const getUserChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await db.message.findAll({
      where: {
        conversation_id: id,
      },
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json(chat);
  } catch (e) {
    res.status(501).json(e);
  }
};

const clearChat = async (req, res) => {
  try {
    const { conv_id } = req.query;
    if (!conv_id) {
      res.status(401).json("no query");
    }
    await db.message.destroy({
      where: {
        conversation_id: conv_id,
      },
    });
    res.status(201).json("The chat has been cleared!");
  } catch (e) {
    res.status(501).json("Something went wrong");
  }
};

const removeChat = async (req, res) => {
  try {
    const { conv_id } = req.query;
    if (!conv_id) {
      res.status(401).json("no query");
    }
    await ConversationService.removeChat(conv_id);
    res.status(201).json("Success");
  } catch (e) {
    res.status(500).json(e);
  }
};

const getChannels = async (req, res) => {
  try {
    const { id } = req.query;
    const existingChannels = await InterfaceService.getChannels(id);
    return res.status(200).json(existingChannels);
  } catch (e) {
    console.log(e);
    res.status(501).json(e);
  }
};

const deleteBot = async (req, res) => {
  try {
    const { id } = req.query;

    const { token } = await BotService.getBotById(id);
    botInstance.botsTG = botInstance.botsTG.filter((bot) => {
      if (bot.token === token) {
        bot.stopPolling();

        return false;
      }
      return true;
    });

    const deletedBot = await BotService.deleteBot(id);
    res.status(200).json(deletedBot);
  } catch (e) {
    res.status(501).json(e);
    console.log(e);
  }
};

module.exports = {
  sendMessage,
  catchMessage,
  getMessages,

  getConversations,
  getUserChat,
  createBotInstance,
  clearChat,
  removeChat,
  getChannels,
  startBots,
  deleteBot,
  socketMessageHandler,
};
