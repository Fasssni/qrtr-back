const express=require("express")

const tgControllers=require('../Controllers/tgControllers')

const router=express.Router()

const {sendMessage, getMessages, getConversations,getUserChat, createBotInstance}=tgControllers

router.post("/sendmessage", sendMessage)

router.get("/getmgs", getMessages)
router.get('/conversations',getConversations)
router.get('/getchat/:id', getUserChat)
router.post(`/createbot`, createBotInstance )


module.exports=router



