const { Sequelize, sequelize } = require("./db.js")

const despesa = sequelize.define("despesa", {
    iddespesa: {
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
    tableName: 'despesa',
    timestamps: false
});

// despesa.create({
//     nome: "tyeste",
//     descricao: "tyeste",
//     preco: "tyeste",
//     imagem: "tyeste",
//     categoria: "tyeste"
// });


module.exports = despesa 