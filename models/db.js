const { Sequelize } = require("sequelize");

//conectando com o banco de dados
const sequelize = new Sequelize("gweb", "root", "", {
    host: "localhost",
    dialect: "mysql",
    port : 3306
});


//verificando conexao com o banco de dados
sequelize.authenticate().then(() => {
    console.log("conectado")
}).catch((erro) => {
    console.log("nao conectado erro :: " + erro)
})


module.exports = { 
    Sequelize, sequelize
}