const db = require(".");

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
        name:{ 
           type:DataTypes.STRING, 
           allowNull:true,
        },
        conversation_id:{ 
          type:DataTypes.INTEGER,
          references:{ 
            model:"conversations",
            key:"id"
          },
          
        }
      },
      {
        timestamps: true,
      }
    );
  
    Message.associate = () => {
      // Define associations, e.g., a message belongs to a user
      Message.belongsTo(db.conversations, {
        foreignKey: {
          allowNull: false,
        },
      });
    };
  
    return Message;
  };
  