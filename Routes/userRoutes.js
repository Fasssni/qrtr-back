
const Router=require("express")
const userController= require("../Controllers/userController")
const userAuth=require("../Middleware/userAuth")

const router=new Router()
const {signup, login}=userController

const test=(req, res)=>{ 
     try{ 
        res.status(201).json(" The test went through")
     }catch(e){
        res.status(501).json("An error occurred")
     }
}

router.post("/signup",userAuth.saveUser, signup)
router.post("/login", login)
router.post("/logout",userController.logout)

router.get("/checkauth", userController.checkAuth)
router.get("/test", test)



module.exports=router


