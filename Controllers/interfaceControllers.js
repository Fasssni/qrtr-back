const { findClientByName } = require("../Services/InterfaceService");

const searchUsersByName = async (req, res) => {
  try {
    const { q } = req.query;
    const users = await findClientByName(q);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = { searchUsersByName };
