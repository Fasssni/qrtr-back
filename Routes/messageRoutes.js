const express=require("express")

const tgControllers=require('../Controllers/tgControllers')

const router=express.Router()

const {sendMessage, getMessages, getConversations,getUserChat}=tgControllers

router.post("/sendmessage", sendMessage)

router.get("/getmgs", getMessages)
router.get('/conversations',getConversations)
router.get('/getchat/', getUserChat)


module.exports=router



