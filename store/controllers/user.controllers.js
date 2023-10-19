const db= require("../db.js")

class UserController {

    async createUser(req, res){ 
        const {name, surname}=req.body

        try{
        const newPerson=await db.query(`INSERT INTO person (name, surname) values ($1, $2) RETURNING *`,[name, surname])
        
        await res.json(newPerson)
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
        const id=req.params.id
        const user= await db.query(`SELECT * FROM person WHERE id=$1`,[id])
        res.json(user)

    }
    async updateUser(req, res){ 
        const {id, name, surname}=req.body
        const updatedData= db.query(`UPDATE person SET name=$1, surname=$2 WHERE id=$3 RETURNING *`, [name, surname, id])
        res.json(updatedData)
    }
    async deleteUser(req, res){ 
        const id=req.params.id
        const updatedData=db.query(`DELETE FROM person WHERE id=$1 RETURNING *`, [id])

        res.json(updatedData.rows)

    }
}

module.exports= new UserController()