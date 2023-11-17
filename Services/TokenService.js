const jwt=require('jsonwebtoken');
const env=require("dotenv").config()
const db=require("../Models")

class TokenService{

    generateAccessToken(id){ 
        const accessToken= jwt.sign({id:id}, process.env.secretKey,{ 
            expiresIn:1*24*60*60*1000,
        })

        return accessToken
        
    }
     async saveAccessToken(token,id){ 
      await db.accessToken.create({user_id:id,accessToken:token})
    }

    async findAccessToken(id){
        const accessToken= await db.accessToken.findOne({
            where:{
                user_id:id
            }
        })
        return accessToken
    }
}

module.exports=new TokenService()