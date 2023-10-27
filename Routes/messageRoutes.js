const express=require("express")

const tgControllers=require('../Controllers/tgControllers')

const router=express.Router()

const {sendMessage, getMessages}=tgControllers

router.post("/sendmessage", sendMessage)
router.get("/getmgs", getMessages)
router.post("createbot", tgControllers.createBot)

module.exports=router



