const express = require("express")

const tgControllers = require('../Controllers/tgControllers')

const router = express.Router()

const {
  sendMessage,
  getMessages,
  getConversations,
  getUserChat,
  createBotInstance,
  clearChat,
  removeChat
} = tgControllers

router.post("/sendmessage", sendMessage)

router.get("/getmgs", getMessages)
router.get('/conversations', getConversations)
router.get('/getchat/:id', getUserChat)
router.post(`/createbot`, createBotInstance)
router.delete("/clearchat", clearChat)
router.delete("/removechat", removeChat)


module.exports = router



