const TelegramApi=require("node-telegram-bot-api")
const token="6523932478:AAEO32hl4iYqvaIoZGxUZV7og2SKtF1BBrU"

const bot=new TelegramApi (token,{polling: true})

const express=require('express')
const cors= require("cors")
const env=require('dotenv').config()
const userRouter= require("./store/routes/user.routes.js")


const PORT=process.env.PORT||3000

const app=express()
app.use(cors())
app.use(express.json())





async function  startBot(){ 
        bot.on( "message", async msg=>{ 
        const text=  msg.text;
        const chatId=msg.chat.id

        console.log(msg)
        if(text.toLowerCase()==="привет"){
    
        await bot.sendMessage(chatId, `Привет, что надо?`)
        return 
        }
        await bot.sendMessage(chatId, `you texted ${text}`)
    }
    )
} 

app.use("/api", userRouter)

async function startApp(){ 
    try{ 
        
        app.listen(PORT,console.log(`it's all started at ${PORT}`))

    }catch(e){ 
         console.log(e.message)
    }
}

startApp()

