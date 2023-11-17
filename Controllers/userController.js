const bcrypt= require("bcrypt");
const db= require("../Models"); 
const jwt=require('jsonwebtoken');
const UserDto = require("./dtos/userDto");
const env=require("dotenv").config()


const User=db.users;
const {generateAccessToken, saveAccessToken}=require("../Services/TokenService")
const UserService=require("../Services/UserService")


const signup=async (req, res)=>{ 
try{ 
        const {name, surname, email, password}=req.body
           const {accessToken, user}=
            UserService.signup({
                    name, 
                    surname, 
                    email, 
                    password
            })
            res.cookie("jwt", accessToken, { maxAge: 1 * 24 * 60 * 60, httpOnly: true});
            console.log("user",JSON.stringify(user, null, 2));
            console.log(accessToken);
            return res.json(201).send(user)
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
        return res.status(401).json("the password is incorrect:(")
       }
     
    }else{ 
        return res.status(401).json("no such user exists")
    }}
 catch(e){ 
    console.log(e)
    
 }
}

 const checkAuth= async (req, res)=>{

    const accessToken=req.cookies.jwt
    if(!accessToken){
        return res.status(401).json("Unautorized")
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
            return res.status(201).json(new UserDto(userData))
        }else{ 
            return res.status(401).json("Unauthorized")
             }
        }catch(err){ 
            return res.status(402).json("сука")
        }
 }
    
    const logout=async(req, res, next)=>{ 
        try {
            const {jwt}=req.cookies
            console.log(jwt, "!!!!!!")
            res.clearCookie("jwt")
            await db.accessToken.destroy({
                where:{
                    accessToken:jwt
                }
            })
            res.status(201).json("You've been logged out")
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