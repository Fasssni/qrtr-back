const bcrypt= require("bcrypt");
const db= require("../Models"); 
const jwt=require('jsonwebtoken');
const UserDto = require("./dtos/userDto");
const env=require("dotenv").config()


const User=db.users;


const signup=async (req, res)=>{ 
try{ 
        const {name, surname, email, password}=req.body
        const data={ 
            name,
            surname,
            email,
            password: await bcrypt.hash(password, 10)
        }
        const user= await User.create(data);

        if(user){ 
            let token= jwt.sign({id:user.id}, process.env.secretKey,{ 
                expiresIn:1*24*60*60*1000,
            })
            const {id}=user
            const accessToken= await db.accessToken.create({user_id:id,accessToken:token})
            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true});
            console.log("user",JSON.stringify(user, null, 2));
            console.log(token);
            return res.json(201).send(user)
        }else{ 
            return res.status(409).send("Details aren't correct")
        }
    }catch(e){
        console.log(e)
    }

}

const login=async (req, res)=>{ 
try{
    const {email, password}=req.body
    const user= await User.findOne({ 
        where:{ 
            email: email
        }
    }); 

    if(user){ 
       const isPassword= await bcrypt.compare(password, user.password) 

       if(isPassword){ 
        let token=jwt.sign({id:user.id},process.env.secretKey,{ 
            expiresIn:1*1*1*60*1000
        })
        //token handler
        const {id}=user
        const accessToken= await db.accessToken.findOne({
            where:{
                user_id:id
            }
        })

        if (accessToken) {
            await db.accessToken.update({ accessToken: token }, { where: { user_id: id } });
          } else {
            await db.accessToken.create({ user_id: id, accessToken: token });
          }

         res.cookie('jwt', token, {maxAge:1*24*60*60*100, httpOnly:true})
         console.log("user", JSON.stringify(user, null,2))
         console.log(token)

         return res.status(201).json({user, accessToken})
       }else{ 
        return res.json(401).send("the password is incorrect:(")
       }
     
    }else{ 
        res.json(401).json("no such user exists")
    }}
 catch(e){ 
    console.log(e)
    
 }
}

const checkAuth= async (req, res)=>{

    const accessToken=req.cookies.jwt
    if(!accessToken){
        return res.status(403).json("Unautorized")
    }
    

    try{
        
        const token=await db.accessToken.findOne({
            where: {
                accessToken: accessToken
            }
        })
        if(token){
            const userData=await User.findOne({
                where:{
                    id:token.user_id
                }
            })
            res.status(201).json(new UserDto(userData))
        }else{ 
            res.status(403).json("Unauthorized")
             }
        }catch(err){ 
            res.status(402).json("сука")
        }
 }
    
    const logout=async(req, res, next)=>{ 
        try {
            const {jwt}=req.cookies
            console.log(jwt, "!!!!!!")
            res.clearCookie(accessToken)
            await db.accessToken.destroy({
                where:{
                    accessToken:accessToken
                }
            })
        }catch(e){
            next(e)
        }

    }
     

module.exports={ 
    signup,
    login,
    checkAuth,
    logout,
}