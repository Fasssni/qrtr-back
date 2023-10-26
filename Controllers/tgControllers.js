const TelegramApi=require("node-telegram-bot-api")
const db = require("../Models")
const token="6523932478:AAEO32hl4iYqvaIoZGxUZV7og2SKtF1BBrU"

const bot=new TelegramApi (token,{polling: true})


const sendMessage= async (req,res,next)=>{ 

         try{
         
         const message= await bot.sendMessage(1262220872, req.body.message)
         const data= await db.message.create({user_id:3,text:message.text})
         res.json(message)
         }catch(e){ 
            
         }
}

const catchMessage=async(req, res)=>{
    try{ 
        bot.on("message", async message=>{
            console.log(message)
            const data=await db.message.create({user_id:3, text:message.text})
           
    })
    }catch(e){ 
            console.log(e)
        }

       
       

    
}

const getMessages = async (req, res) => {
    try {
        const messages = await db.message.findAll({
            where: {
                user_id: 3
            }
        });
        res.status(200).json(messages);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports={ 
    sendMessage,
    catchMessage,
    getMessages

}