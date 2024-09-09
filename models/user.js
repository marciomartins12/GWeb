const { Sequelize, sequelize } = require("./db.js")

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
        allowNull: true
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: true
    },endereco: {
        type: Sequelize.STRING,
        allowNull: true
    },logradouro: {
        type: Sequelize.STRING,
        allowNull: true
    },cep: {
        type: Sequelize.STRING,
        allowNull: true
    },bairro: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    tableName: 'user',
    timestamps: false
});

// user.create({
//     nome: "tyeste",
//     descricao: "tyeste",
//     preco: "tyeste",
//     imagem: "tyeste",
//     categoria: "tyeste"
// });


module.exports = user 