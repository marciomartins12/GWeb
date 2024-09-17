const { Sequelize, sequelize } = require("./db");


const user = sequelize.define("user", {
    iduser: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    bio: {
        type: Sequelize.STRING,
        allowNull: false
    },
    foto_perfil: {
        type: Sequelize.BLOB("medium"),
        allowNull: true
    },
    data_criacao: {
        type: Sequelize.DATE,
        allowNull: false
    },
}, {
    tableName: 'user',
    timestamps: false
})
module.exports = user