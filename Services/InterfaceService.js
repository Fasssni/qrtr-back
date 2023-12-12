const db = require("../Models")


class InterfaceService{ 
    async getChannels(id){ 
     const channels=await db.botToken.findAll({
        where:{ 
            user_id:id
        }
     })
     return channels
    }
}

module.exports=new InterfaceService()