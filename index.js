const express=require('express')
const cors= require("cors")
const env=require('dotenv').config()
const cookieParser= require("cookie-parser")
const sequelize=require("sequelize")
const bcrypt=require('bcrypt')


const userRouter= require("./store/routes/user.routes.js")
const PostController=require("./store/routes/post.routes.js")
const userRoutes=require("./Routes/userRoutes.js")
const db = require('./Models/index.js')

const PORT=process.env.PORT||3000

const app=express()

//middleware
app.use(cors({
    credentials:true, 
    origin:'http://localhost:5173'
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api", userRouter)
app.use("/api", PostController )

app.use("/apiv/",userRoutes )

db.sequelize.sync({ force: false }).then(() => {
    console.log("db has been re sync")
})

async function startApp(){ 
    try{ 
        
        app.listen(PORT,console.log(`it's all started at ${PORT}`))

    }catch(e){ 
         console.log(e.message)
    }
}

startApp()

