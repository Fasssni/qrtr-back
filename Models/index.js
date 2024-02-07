const env = require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES, {
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database has been connected");
  })
  .catch((err) => {
    console.log(err.message, "this");
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel")(sequelize, DataTypes);
db.accessToken = require("./tokenModel")(sequelize, DataTypes);
db.message = require("./messageModels")(sequelize, DataTypes);
db.conversations = require("./conversationModels")(sequelize, DataTypes);
db.botToken = require("./botModel")(sequelize, DataTypes);
db.template = require("./templateModel")(sequelize, DataTypes);

module.exports = db;
