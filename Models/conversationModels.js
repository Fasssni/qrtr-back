

module.exports=(sequelize, DataTypes)=>{
     const Conversation=sequelize.define("conversation", {
        user_id:{ 
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{ 
                model:"users",
                key:"id",
        }}, 
        to_id:{
            type:DataTypes.BIGINT,
            allowNull:false,
        },
        client_name:{ 
            type: DataTypes.STRING,
            allowNull:true,
          },
        user_pic:{ 
            type:DataTypes.STRING,
            allowNull:true,
        }, 
        bot_id:{ 
          allowNull:true, 
          type:DataTypes.INTEGER,
          references:{ 
            model:"botTokens", 
            key:"id",
          }
        }
        },
        {timestaps:true}
     )

     Conversation.associate=()=>{ 
        Conversation.belongsTo(db.users, {
            foreignKey: {
              allowNull: false,
            },
          });

          Conversation.hasMany(db.message, { 
            foreignKey:{
                allowNull:false,
            }
          })

          Conversation.hasOne(db.botToken, { 
            foreignKey:{
                allowNull:true,
            }
          })
        };
      

     
    return Conversation
     

     
}