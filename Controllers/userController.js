const bcrypt= require("bcrypt");
const db= require("../Models"); 
const jwt=require('jsonwebtoken');
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
            expiresIn:1*24*60*60*1000
        })
         res.cookie('jwt', token, {maxAge:1*24*60*60*100, httpOnly:true})
         console.log("user", JSON.stringify(user, null,2))
         console.log(token)

         return res.status(201).send(user)
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


module.exports={ 
    signup,
    login,
}