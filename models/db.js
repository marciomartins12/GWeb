const { Sequelize } = require("sequelize");

//conectando com o banco de dados
const sequelize = new Sequelize("sql10730434", "sql10730434", "VUcNWeRdxe", {
    host: "sql10.freesqldatabase.com",
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