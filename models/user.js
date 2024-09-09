const { Sequelize, sequelize } = require("./db.js")

const user = sequelize.define("user", {
    iduser: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: true
    }, nome: {
        type: Sequelize.STRING,
        allowNull: false
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