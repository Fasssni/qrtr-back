const db = require("../Models")
 
class MessageService{ 
    async removeMessagesByConvId(conversation_id){ 
        await db.message.destroy({
            where:{
                conversation_id
            }
        })
    }


}

module.exports=new MessageService()