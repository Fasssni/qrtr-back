const TelegramApi=require("node-telegram-bot-api")
const db = require("../Models")

const token="6523932478:AAEO32hl4iYqvaIoZGxUZV7og2SKtF1BBrU"

const wss=require("../WebSockets/websocket")
// const bot=new TelegramApi (token,{polling: true})

const {checkAuth}=require("./userController")
const PORT=process.env.PORT

let botInstance=null

const createBotInstance=async (req, res)=>{ 
      const {user_id}=req.query
      const {token}=req.body

      const isToken=await db.botToken.findOne({
        where:{
          token:token
        }
      })
      
      if(isToken){ 
        res.status(401).json(isToken)
      }else{ 
        const newBot= new TelegramApi(token,{polling:true})
        const {username}= await newBot.getMe()
        await newBot.stopPolling()
        const botToken= await db.botToken.create({ 
          token:token, 
          user_id:user_id,
          name:username,

        })
        botInstance=null
        await catchMessage()
        res.status(201).json(botToken)
      }

      return 


}

const startBots=async()=>{ 
  try{ 
    if(!botInstance){
        const botsDB= await db.botToken.findAll()
        const botsTG= botsDB.map((bot)=>new TelegramApi (bot.token,{polling: true}))
        botInstance= {botsDB,botsTG}
    }
    return botInstance
  }catch(e){ 
     console.log(e)
  }
}




console.log(botInstance, "bots started!")

const sendMessage= async (req,res,next)=>{ 
         
        
         try{
            const {id}=req.query
            const {user_id, text, name, to_id}=req.body
            const {botsTG, botsDB}=await startBots()
            const conversation=await db.conversations.findOne({
              where:{ 
                id:id
              }
            })
            console.log(conversation)
            // const botdb= db.botToken.findOne({ 
            //   where:{
            //     id:conversation.bot_id
            //   }
            // })
            const botdb=botsDB.find(item=>item.id===conversation.bot_id)
            const bot=botsTG.find(item=>item.token===botdb.token)
            console.log(botsTG, "gegeg")
            const message= await bot.sendMessage(to_id, text)
            const data= await db.message.create({
                user_id:user_id,
                text:text,  
                name:name, 
                conversation_id:id
             })
            res.status(200).json(data)
            socketMessageHandler(data)
            
         }catch(e){ 
            console.log(e)
            res.status(501).json(e.message)
            
         }
}




const catchMessage=async(req, res, next)=>{
    const {botsTG}=await startBots()
    
    try{ 
        botsTG.forEach((bot)=>{
        bot.on("message", async message=>{
          console.log(bot)
            const  botdb= await db.botToken.findOne({
              where:{
                token:bot.token
              }
            })
            const getMe=await bot.getMe()
            console.log(getMe, "Getme")
            const isConversation=await db.conversations.findOne({
                 where:{
                    to_id:message.from.id,
                    bot_id:botdb.id
                 }
            })
            if(isConversation){
               const data=await db.message.create({
                                            user_id:isConversation.user_id, 
                                            text:message.text, 
                                            name:message.from.first_name, 
                                            conversation_id:isConversation.id
                                          })
               socketMessageHandler(data)
            }else{ 
              const imageUrl = await getUserPhoto(message.from.id, bot.token);
              console.log(imageUrl)
              if(imageUrl){ 
                  const conversation=await db.conversations.create({
                      user_id:1, 
                      to_id:message.from.id, 
                      client_name:message.from.first_name,
                      user_pic:imageUrl,
                      bot_id:botdb.id
                       
                  })
                  const data=await db.message.create({
                      user_id:1, 
                      text:message.text, 
                      name:message.from.first_name, 
                      conversation_id:conversation.id,
                    
                  })
                  socketConvHandler(conversation)
                  socketMessageHandler(data)
                }else{ 
                  const conversation=await db.conversations.create({
                    user_id:1, 
                    to_id:message.from.id, 
                    client_name:message.from.first_name,
                    user_pic:null,
                    bot_id:botdb.id
                })
                const data=await db.message.create({
                    user_id:1, 
                    text:message.text, 
                    name:message.from.first_name, 
                    conversation_id:conversation.id,
                })
                socketConvHandler(conversation)
                socketMessageHandler(data)
                }
  
            }  
          
    })
  })
   
  }catch(e){ 
            console.log(e)
            next(e)
  }
}


const socketConvHandler=(value)=>{ 
  
  wss.clients.forEach(client => {
    client.send(JSON.stringify({method:"new-conversation", message:value}))
})    
}

const socketMessageHandler=(value)=>{ 
  console.log("the socket has been called")
  wss.clients.forEach(client => {
    client.send(JSON.stringify({method:"message", message:value}))
})    
}

const getUserPhoto = async (client_id, token ) => {
    try {
      const {botsTG}=await startBots()
      const bot=botsTG.find((item)=>item.token===token)
      const profile = await bot.getUserProfilePhotos(client_id, { limit: 1 });
   
      const profilePic=profile.photos
      console.log(profilePic, "profile pic")
  
      if (profilePic.length > 0) {
        const file_id = profilePic[0][0]?.file_id;
        const getFileUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${file_id}`;
        console.log(getFileUrl)
        const urlResponse = await fetch(getFileUrl);
  
        if (urlResponse.ok) {
          const fileInfo = await urlResponse.json();
  
          if (fileInfo.ok) {
            const imageUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.result.file_path}`;
            console.log(imageUrl)
            return imageUrl;
          } else {
            console.error('Error getting file information:', fileInfo);
          }
        } else {
          console.error('Error fetching URL:', urlResponse.statusText);
        }
      } else {
        console.error('No profile picture available.');
      }
    } catch (e) {
      console.error('Error:', e);
    }
  };
  

 
const getMessages = async (req, res) => {
    try {
        const {user_id}=req.query
        const messages = await db.message.findAll({
            where: {
                user_id: user_id
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
        const {user_id}=req.query
        const conversations=await db.conversations.findAll({
          where:{
            user_id:user_id
          }}
        )
        res.status(200).json(conversations)

    }catch(e){ 
        res.status(501).json("Something went wrong on the server")

    }
  }
  
   const getUserChat=async(req, res)=>{
     try{
         const {user_id}=req.query
         const {id}=req.params
         const chat= await db.message.findAll({
            where:{
                conversation_id:id, 
                user_id:user_id,
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
    createBotInstance,

}