const epxress = require("express");
const router = epxress.Router();

const userController = require("../Controllers/userController");

const { getChannels } = require("../Controllers/tgControllers");
const { searchUsersByName } = require("../Controllers/interfaceControllers");

router.get("/getchannels", getChannels);
router.get("/searchclient", userController.checkAuth, searchUsersByName);

module.exports = router;
