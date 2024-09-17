const {Sequelize} = require("sequelize");

const sequelize =new Sequelize("instagram", "root", "",{
    host : "localhost",
    dialect : "mysql"
});

sequelize.authenticate().then(()=>{
    console.log("conectado")
}).catch((er)=>{
console.log(`houve um erro: ${er}`)
})