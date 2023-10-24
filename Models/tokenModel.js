module.exports = (sequelize, DataTypes) => {
    const accessToken = sequelize.define("token", {
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        accessToken: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        }
    },
        {
            timestamps: true
        }
    );
    return accessToken;
};