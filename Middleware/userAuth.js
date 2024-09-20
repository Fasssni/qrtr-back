const express = require("express");

const db = require("../Models");
const { findAccessToken } = require("../Services/TokenService");
const User = db.users;

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(403).json("Unauthorized");
    }

    const accessToken = await findAccessToken(token);
    if (!accessToken) {
      return res.status(403).json("Unauthorized");
    }

    const userData = await User.findOne({
      where: {
        id: accessToken.user_id,
      },
    });
    if (!userData) {
      return res.status(403).json("Unauthorized");
    }

    next();
  } catch (err) {
    res.status(500).json(err);
  }
};

const saveUser = async (req, res, next) => {
  try {
    const emailcheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (emailcheck)
      return res
        .status(401)
        .json({ error: "The e-mail has already been taken" });
    next();
  } catch (err) {
    console.log(err);
  }
};

const getChat = async (user_id, id) => {
  try {
    const { user_id } = req.query;
    const { id } = req.params;
    const conversation = await db.conversations.findOne({
      where: {
        id: id,
      },
    });

    if (conversation.user_id !== user_id) {
      res.status(403).json("you don't have an access to this conversation");
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = {
  saveUser,
  getChat,
  isAuth,
};
