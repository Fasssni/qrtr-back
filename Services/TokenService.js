const jwt = require('jsonwebtoken');
const db = require("../Models")

class TokenService {

    generateAccessToken(id) {
        const accessToken = jwt.sign({ id: id }, process.env.secretKey, {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
        })

        return accessToken

    }
    async saveAccessToken(token, id) {
        await db.accessToken.create({ user_id: id, accessToken: token })
    }

    async findAccessTokenById(id) {
        const accessToken = await db.accessToken.findOne({
            where: {
                user_id: id
            }
        })
        return accessToken
    }

    async findAccessToken(token){ 
        const accessToken = await db.accessToken.findOne({
            where: {
                accessToken: token
            }
        })
        return accessToken
    }
    
    async destroyAccessToken(token){
        await db.accessToken.destroy({
            where: {
                accessToken: token
            }
        })
    }
}

module.exports = new TokenService()