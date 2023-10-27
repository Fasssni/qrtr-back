
module.exports=(sequelize, DataTypes)=>{
    const User=sequelize.define("user", { 
        name:{ 
            type: DataTypes.STRING, 
            unique: false, 
            isEmail: true, 
            allowNull: false
        }, 
        surname:{
            type:DataTypes.STRING,
            unique:false,
            isEmail:false,
            allowNull:false

        },
        email:{ 
            type: DataTypes.STRING, 
            unique:true, 
            isEmail:true, 
            allowNull:false
        },
        password:{ 
            type: DataTypes.STRING, 
            allowNull: false
        }
    },
    {
        timestamps:true
    },
   
    )
    User.associate = (model) => {
        // Define associations, e.g., a user has many messages
        User.hasMany(db.conversations);
      }
    return User

}