const db = require("../Models");

class TemplateService {
  async createTemplate(data) {
    const template = db.template.create(data);
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
}

module.exports = new TemplateService();
