
const Router=require("express")
const userController= require("../Controllers/userController")
const userAuth=require("../Middleware/userAuth")

const router=new Router()
const {signup, login}=userController

router.post("/signup",userAuth.saveUser, signup)
router.post("/login", login)
router.get("/checkauth", userController.checkAuth)
router.post("/logout",userController.logout)

module.exports=router


