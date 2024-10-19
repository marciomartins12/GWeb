const { Sequelize, sequelize } = require("./db");

const notificacoes = sequelize.define("notificacoes", {
    idnotificacoes: {
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
    content: {
        type: Sequelize.STRING,
        allowNull: true
    }

},
    {
        tableName: "notificacoes",
        timestamps: false
    })

    module.exports = notificacoes