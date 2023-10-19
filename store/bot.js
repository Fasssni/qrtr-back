const TelegramApi=require("node-telegram-bot-api")
const token="6523932478:AAEO32hl4iYqvaIoZGxUZV7og2SKtF1BBrU"

const bot=new TelegramApi (token,{polling: true})

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
