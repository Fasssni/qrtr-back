const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const UserDto = require("./dtos/userDto");
const env = require("dotenv").config();

const User = db.users;
const UserService = require("../Services/UserService");
const TokenService = require("../Services/TokenService");

const signup = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;
    const { accessToken, user } = await UserService.signup({
      name,
      surname,
      email,
      password,
    });
    res.status(201).json(user);
  } catch (e) {
    console.log(e);
    const errorMessage = e.message || "Something went wrong";
    res.status(401).json({ error: errorMessage });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await UserService.login({ email, password });
    res.cookie("jwt", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });
    return res.status(201).json({ token, user });
  } catch (e) {
    console.log(e);
    const errorMessage = e.message || "An error occurred";
    return res.status(402).json({ error: errorMessage });
  }
};

const checkAuth = async (req, res) => {
  const accessToken = req.cookies.jwt;

  if (!accessToken) {
    return res.status(401).json("Unautorized !");
  }
  try {
    const userData = await UserService.checkauth(accessToken);
    return res.status(201).json(new UserDto(userData));
  } catch (err) {
    if (err.message === "Unauthorized") {
      return res.status(401).json(err.message);
    }
    return res.status(500).json("Unexpected error");
  }
};

const logout = async (req, res, next) => {
  try {
    const { jwt } = req.cookies;
    res.clearCookie("jwt");
    await TokenService.destroyAccessToken(jwt);
    res.status(201).json("You've been logged out");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  signup,
  login,
  checkAuth,
  logout,
};
