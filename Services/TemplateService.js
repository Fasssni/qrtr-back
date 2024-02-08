const db = require("../Models");

class TemplateService {
  async createTemplate(data) {
    try {
      const template = await db.template.create(data);

      return template;
    } catch (err) {
      console.log(err);
    }
  }
  async findTemplate(bot_id, trigger) {
    const greeting = await db.template.findOne({
      where: {
        bot_id,
        triggersTo: trigger,
      },
    });

    return greeting;
  }

  async deleteTemplateByBotId(bot_id) {
    try {
      const deleted = await db.template.destroy({
        where: {
          bot_id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new TemplateService();
