const { Sequelize, sequelize } = require("./db");


const post = sequelize.define("post", {
    idpost: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    legenda: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imagem_post: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_post: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    tableName: 'post',
    timestamps: false
})