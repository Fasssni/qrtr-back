const Router= require("express")
const userControllers = require("../controllers/user.controllers")

const router=new Router()

router.post("/user",userControllers.createUser)
router.get("/users",userControllers.getUsers)
router.get("/user/:id", userControllers.getOneUser)
router.put("/user", userControllers.updateUser)
router.delete("/user/:id", userControllers.deleteUser)

module.exports= router;