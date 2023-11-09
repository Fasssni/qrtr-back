module.exports=(sequelize, DataTypes)=>{ 
     const botToken=sequelize.define("botToken", {
        token:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false,

        },
        user_id:{ 
            allowNull:false,
            type:DataTypes.INTEGER,
            references:{
                model:"users", 
                key:"id",
            }
        }, 
        name:{ 
            allowNull:false, 
            type:DataTypes.STRING
        }
        
     },{
        timestaps:true
     })

     botToken.associate=()=>{ 
        botToken.belongsTo(db.users, {
            foreignKey: {
              allowNull: false,
            },
          });

}
return botToken
}