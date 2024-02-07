const db = require(".");

module.exports = (sequelize, DataTypes) => {
  const Template = sequelize.define(
    "template",
    {
      bot_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "botTokens",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      triggersTo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestaps: true }
  );

  Template.associate = () => {
    Template.belongsTo(db.botToken, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Template;
};
