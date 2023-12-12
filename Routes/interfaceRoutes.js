const epxress= require('express')
const router=epxress.Router()

const {getChannels}=require("../Controllers/tgControllers")

router.get("/getchannels", getChannels)

module.exports=router