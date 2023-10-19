
const db=require("../db.js")
class PostController{ 
    async createPost(req, res){ 

      try{
       const { title, user_id}=req.body
       const newPost = await db.query(
        `INSERT INTO post(title, user_id) values ($1, $2) RETURNING *`,
        [title, user_id]
      );

       res.json(newPost.rows)
      }catch(e){ 
        console.log(e.message)
      }
    }

    async getPosts(req, res){ 

        const posts=await db.query("SELECT * FROM post")

        res.json(posts.rows)
        

    }

    async getUserPost(req, res){
        const id=req.query.id
        const usersPosts=await db.query(`SELECT * FROM post WHERE user_id=$1`, [id]) 

        res.json(usersPosts) 

    }
}

module.exports= new PostController()