const express=require("express");

const db=require("../Models");
const User=db.users

const saveUser=async(req, res,next)=>{ 

    try{ 
        
        const emailcheck= await User.findOne( {
            where:{ 
                email:req.body.email
            }
        })
        if(emailcheck)return res.json(409).send("The email has already been taken :<")
        next()
    }catch(err){ 
        console.log(err)
    }
    
}

 const getChat=async (user_id, id)=>{ 
    try{
        const {user_id}=req.query
        const {id}=req.params
        const conversation= await db.conversations.findOne({ 
            where:{ 
                id:id
            }
        })

        if(conversation.user_id!==user_id){
            res.status(403). json("you don't have an access to this conversation")
        }

    }catch(e){
        res.status(500).json(e)

    }
 }

module.exports={ 
    saveUser,
    getChat
}