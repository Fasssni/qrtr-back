const db= require("../db.js")

class UserController {

    async createUser(req, res){ 
        const {name, surname}=req.body

        try{
        const newPerson=await db.query(`INSERT INTO person (name, surname) values ($1, $2) RETURNING *`,[name, surname])
        
        await res.json(newPerson.rows)
        }catch(e){ 
            console.log(e.message)
        }
    }
    async getUsers(req, res){
        
        try{ 
            const data= await db.query(`SELECT * from person`)
            res.json(data)
        }catch(e){ 
            console.log(e)

        }

    }
    async getOneUser(req, res){ 

    }
    async updateUser(req, res){ 

    }
    async deleteUser(req, res){ 

    }
}

module.exports= new UserController()