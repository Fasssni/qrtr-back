const express=require("express")

const tgControllers=require('../Controllers/tgControllers')

const router=express.Router()

const {sendMessage, getMessages}=tgControllers

router.post("/sendmessage", sendMessage)
router.get("/getmgs", getMessages)

module.exports=router



