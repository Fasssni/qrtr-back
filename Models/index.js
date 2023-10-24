const {Sequelize, DataTypes}= require("sequelize")

const sequelize = new Sequelize("postgres://postgres:N2001i2001n@localhost:5432/serverdb", {
  dialect: "postgres"
});

sequelize.authenticate().then(()=>{ 
    console.log("Database has been connected")
}).catch((err)=>{
    console.log(err.message, "this")
})

const db={}

db.Sequelize=Sequelize
db.sequelize=sequelize

db.users=require("./userModel")(sequelize, DataTypes)
db.accessToken= require('./tokenModel')(sequelize,DataTypes)

module.exports=db