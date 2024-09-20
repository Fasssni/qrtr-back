const express = require("express");

const tgControllers = require("../Controllers/tgControllers");

const router = express.Router();

const {
  sendMessage,
  getMessages,
  getConversations,
  getUserChat,
  createBotInstance,
  clearChat,
  removeChat,
  deleteBot,
} = tgControllers;

const {
  getUserTemplates,
  addTemplate,
} = require("../Controllers/botControllers");
const { isAuth } = require("../Middleware/userAuth");

router.post("/sendmessage", isAuth, sendMessage);
router.post("/addtemplate", addTemplate);

router.get("/getmgs", getMessages);
router.get("/conversations", getConversations);
router.get("/getchat/:id", isAuth, getUserChat);
router.get("/gettemplates/:bot_id", getUserTemplates);
router.post(`/createbot`, createBotInstance);
router.delete("/clearchat", clearChat);
router.delete("/removechat", removeChat);
router.delete("/deletebot", deleteBot);

module.exports = router;
