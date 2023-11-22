const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require('jsonwebtoken');
const UserDto = require("./dtos/userDto");
const env = require("dotenv").config()


const User = db.users;
const UserService = require("../Services/UserService");
const TokenService = require("../Services/TokenService");


const signup = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body
        const { accessToken, user } =
            UserService.signup({
                name,
                surname,
                email,
                password
            })
        res.cookie("jwt", accessToken, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(accessToken);
        return res.json(201).send(user)
    } catch (e) {
        console.log(e)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const {token, user}= await UserService.login({email, password})
        res.cookie('jwt', token, { maxAge: 1 * 24 * 60 * 60 * 100, httpOnly: true })
        console.log("user", JSON.stringify(user, null, 2))
        return res.status(201).json({token, user})
    }
    catch (e) {
        res.status(401).json(e)

    }
}

const checkAuth = async (req, res) => {

    const accessToken = req.cookies.jwt

    if (!accessToken) {
        return res.status(401).json("Unautorized !")
    }
    try {
        const userData=await UserService.checkauth(accessToken)
        return res.status(201).json(new UserDto(userData)) 
    } catch (err) {
        if(err.message==="Unauthorized"){
            return res.status(401).json(err.message)
        }
        return res.status(500).json("Unexpected error")
    }
}

const logout = async (req, res, next) => {
    try {
        const { jwt } = req.cookies
        res.clearCookie("jwt")
        await TokenService.destroyAccessToken(jwt)
        res.status(201).json("You've been logged out")
    } catch (e) {
        next(e)
    }

}


module.exports = {
    signup,
    login,
    checkAuth,
    logout,
}