module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define(
      'message',
      { 
        user_id:{
         type:DataTypes.INTEGER,
         references:{ 
            model:"users", 
            key:"id",
         }
      },
        text: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        timestamps: true,
      }
    );
  
    Message.associate = (models) => {
      // Define associations, e.g., a message belongs to a user
      Message.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
      });
    };
  
    return Message;
  };
  