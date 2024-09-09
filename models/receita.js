const { Sequelize, sequelize } = require("./db.js")

const receita = sequelize.define("receita", {
    idreceita: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    quantia: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    categoria: {
        type: Sequelize.STRING,
        allowNull: true
    }, descricao: {
        type: Sequelize.STRING,
        allowNull: false
    }
    , iduser: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'receita',
    timestamps: false
});

// receita.create({
//     nome: "tyeste",
//     descricao: "tyeste",
//     preco: "tyeste",
//     imagem: "tyeste",
//     categoria: "tyeste"
// });


module.exports = receita 