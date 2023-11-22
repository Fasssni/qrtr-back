
const db = require("../Models")
const bcrypt = require("bcrypt");
const { 
        generateAccessToken, 
        saveAccessToken, 
        findAccessTokenById,
        findAccessToken,
        } = require("./TokenService")
const User = db.users;

class UserService {
    async signup({ name, surname, email, password }) {
        const isUser = await User.findOne({
            where: {
                email: email
            }
        })

        if (!isUser) {
            const data = {
                name,
                surname,
                email,
                password: await bcrypt.hash(password, 10)
            }
            const user = await User.create(data);
            const { id } = user
            const accessToken = generateAccessToken(id)
            saveAccessToken(accessToken, id)
            return { accessToken, user }
        } else {
            throw new Error("The e-mail has already been taken")
        }

    }

    async login({ email, password }) {
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            const isPassword = await bcrypt.compare(password, user.password)

            if (isPassword) {
                let token = generateAccessToken(user.id)

                const { id } = user
                
                const isToken= await findAccessTokenById(id)

                if (isToken) {
                    await db.accessToken.update({ 
                        accessToken: token 
                    }, 
                    {
                        where: { 
                            user_id: id 
                        } 
                    })
                } else {
                    saveAccessToken(token, user.id)
                }

               return {token, user}
            }
            else {
                throw new Error("The password is incorrect")
            }

        } else {
            throw new Error("No such user exists")
        }

    }

    async checkauth(token) {

        const accessToken = await findAccessToken(token)
       
        if (accessToken) {
            const userData = await User.findOne({
                where: {
                    id: accessToken.user_id
                }
            })
         return userData
        }else{ 
            throw new Error("Unauthorized")
        }
}

}

module.exports = new UserService()