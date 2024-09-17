const { Sequelize, sequelize } = require("./db");


const likes = sequelize.define("likes", {
    idlike: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    post_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'likes',
    timestamps: false
})