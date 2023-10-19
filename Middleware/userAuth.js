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

module.exports={ 
    saveUser,
}