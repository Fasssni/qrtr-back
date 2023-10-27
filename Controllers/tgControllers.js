const TelegramApi=require("node-telegram-bot-api")
const db = require("../Models")
const token="6523932478:AAEO32hl4iYqvaIoZGxUZV7og2SKtF1BBrU"

const bot=new TelegramApi (token,{polling: true})


const sendMessage= async (req,res,next)=>{ 
        
         try{
            const {id}=req.query
            const message= await bot.sendMessage(1164345495, req.body.message)
            const data= await db.message.create({user_id:1,text:req.body.message,  name:req.body.name, conversation_id:id})
            res.status(200).json(message)
            console.log(message)
         }catch(e){ 
            console.log(e)
            res.status(501).json(e.message)
            
         }
}

const catchMessage=async(req, res)=>{
    try{ 
        bot.on("message", async message=>{
            console.log(message)
            const isConversation=await db.conversations.findOne({
                 where:{
                    to_id:message.from.id
                 }
            })
            if(isConversation){
                const data=await db.message.create({user_id:1, text:message.text, name:message.from.first_name, conversation_id:isConversation.id})
            }else{ 
                const conversation=await db.conversations.create({user_id:1, to_id:message.from.id, client_name:message.from.first_name})
                await db.message.create({user_id:1, text:message.text, name:message.from.first_name, conversation_id:conversation.id})
            }
           
    })
    }catch(e){ 
            console.log(e)
        }

       
       

    
}

// const getUserPhoto=async (id)=>{ 
//     try{ 
//         const userPhoto=await bot.getUserProfilePhotos(1164345495)
//         console.log(userPhoto.photos)
//     }catch(e){
//          console.log(e)
//     }
// }

const getMessages = async (req, res) => {
    try {
        const messages = await db.message.findAll({
            where: {
                user_id: 1
            }
        });
        res.status(200).json(messages);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}; 

  const getConversations=async (req, res)=>{ 
    try{ 
        const conversations=await db.conversations.findAll()
        res.status(200).json(conversations)

    }catch(e){ 
        res.status(501).json("Something went wrong on the server")

    }
  }
  
   const getUserChat=async(req, res)=>{
     try{
         const {id}=req.query
         const chat= await db.message.findAll({
            where:{
                conversation_id:id
            }
         })
         res.status(200).json(chat)
        }catch(e){ 
          res.status(501).json(e)
        }
   }


const createBot=async(req, res)=>{
    const response=req.body.cookies
    console.log(response)
     

}


module.exports={ 
    sendMessage,
    catchMessage,
    getMessages,
    createBot,
    getConversations,
    getUserChat,

}