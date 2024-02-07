const { findTemplate } = require("../Services/TemplateService");
const { createMessage } = require("../Services/MessageService");
const startAutomations = async ({
  bot_id,
  bot,
  message,
  user_id,
  conversation_id,
}) => {
  console.log("it has been trgiggered");
  const sendGreeting = async () => {
    try {
      const template = await findTemplate(bot_id, message.text);

      if (template) {
        await bot.sendMessage(message.from.id, template.text);
        await createMessage({
          user_id,
          text: template.text,
          name: message.from.first_name,
          conversation_id,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  await sendGreeting();
};

module.exports = {
  startAutomations,
};
