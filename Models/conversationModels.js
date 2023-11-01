

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
        };
      

     
    return Conversation
     

     
}