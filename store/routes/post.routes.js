const Router=require('express')

const PostController=require("../controllers/post.controllers")
const router=new Router()



router.post("/post", PostController.createPost)
router.get("/posts", PostController.getPosts)
router.get("/userPost", PostController.getUserPost)

module.exports=router