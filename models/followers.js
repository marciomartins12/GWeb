const { Sequelize, sequelize } = require("./db");


const follower = sequelize.define("follower", {
    idfollower: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    seguidor_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    data_follower: {
        type: Sequelize.DATE,
        allowNull: false
    },
}, {
    tableName: 'follower',
    timestamps: false
})
module.exports = follower