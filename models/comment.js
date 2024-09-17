const { Sequelize, sequelize } = require("./db");

const comment = sequelize.define("comment", {
    idcomment: {
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
    },
    conteudo: {
        type: Sequelize.STRING,
        allowNull: true
    },
    data_comment: {
        type: Sequelize.DATE,
        allowNull: true
    }

},
    {
        tableName: "comment",
        timestamps: false
    })

    module.exports = comment