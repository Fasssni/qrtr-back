const TelegramApi=require("node-telegram-bot-api")
const db = require("../Models")

const token="6523932478:AAEO32hl4iYqvaIoZGxUZV7og2SKtF1BBrU"

const wss=require("../WebSockets/websocket")
const bot=new TelegramApi (token,{polling: true})

const {checkAuth}=require("./userController")
const PORT=process.env.PORT

const createToken=()=>{

}


const sendMessage= async (req,res,next)=>{ 
        
         try{
            const {id}=req.query
            const {user_id, text, name, to_id}=req.body
            const message= await bot.sendMessage(to_id, text)
            const data= await db.message.create({
                user_id:user_id,
                text:text,  
                name:name, 
                conversation_id:id
             })
            res.status(200).json(data)
            console.log(message)
         }catch(e){ 
            console.log(e)
            res.status(501).json(e.message)
            
         }
}

const catchMessage=async(req, res, next)=>{
    try{ 
        bot.on("message", async message=>{
            console.log(message)
            const isConversation=await db.conversations.findOne({
                 where:{
                    to_id:message.from.id
                 }
            })
            if(isConversation){
               const data=await db.message.create({user_id:isConversation.user_id, text:message.text, name:message.from.first_name, conversation_id:isConversation.id})
               socketMessageHandler(data)
            }else{ 
            
             
              const imageUrl = await getUserPhoto(message.from.id);
              if(imageUrl){ 
                  const conversation=await db.conversations.create({
                      user_id:1, 
                      to_id:message.from.id, 
                      client_name:message.from.first_name,
                      user_pic:imageUrl,
                  })
                  const data=await db.message.create({
                      user_id:1, 
                      text:message.text, 
                      name:message.from.first_name, 
                      conversation_id:conversation.id,
                  })
                  socketMessageHandler(data)
                }else{ 
                  const conversation=await db.conversations.create({
                    user_id:1, 
                    to_id:message.from.id, 
                    client_name:message.from.first_name,
                    user_pic:null,
                })
                const data=await db.message.create({
                    user_id:1, 
                    text:message.text, 
                    name:message.from.first_name, 
                    conversation_id:conversation.id,
                })
                socketMessageHandler(data)
                }
  
            }  
          
    })
   
  }catch(e){ 
            console.log(e)
            next(e)
  }
}

const socketMessageHandler=(value)=>{ 
  wss.clients.forEach(client => {
    client.send(JSON.stringify({method:"message", message:value}))
})    
}

const getUserPhoto = async (client_id) => {
    try {
      const profile = await bot.getUserProfilePhotos(client_id, { limit: 1 });
   
      const profilePic=profile.photos
      console.log(profilePic)
  
      if (profilePic.length > 0) {
        const file_id = profilePic[0][0]?.file_id;
        const getFileUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${file_id}`;
        
        const urlResponse = await fetch(getFileUrl);
  
        if (urlResponse.ok) {
          const fileInfo = await urlResponse.json();
  
          if (fileInfo.ok) {
            const imageUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.result.file_path}`;
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

}