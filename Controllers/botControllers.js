const {
  findTemplate,
  getTemplatesByBotId,
} = require("../Services/TemplateService");
const { createMessage } = require("../Services/MessageService");
const { socketMessageHandler } = require("./tgControllers");

const startAutomations = async ({
  bot_id,
  bot,
  message,
  user_id,
  conversation_id,
}) => {
  const sendTemplate = async () => {
    try {
      const template = await findTemplate(bot_id, message.text);

      if (template) {
        await bot.sendMessage(message.from.id, template.text);
        const messageData = await createMessage(
          user_id,
          template.text,
          message.from.first_name,
          conversation_id
        );

        socketMessageHandler(messageData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  await sendTemplate();
};

const getUserTemplates = async (req, res) => {
  try {
    const { bot_id } = req.params;
    const templates = await getTemplatesByBotId(bot_id);
    res.status(201).json(templates);
  } catch (err) {
    res.status(501).json(err.message);
  }
};

module.exports = {
  startAutomations,
  getUserTemplates,
};
