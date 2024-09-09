
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars")
const path = require('path');
const User = require("./models/user.js")
const router = require("./routes/mainRoutes");
const app = express();


//configurando o engine 
app.engine("handlebars", engine({
    defaultLayout: "main", runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }
}));
app.set("view engine", "handlebars")
// configuração do Handlebars
app.engine("handlebars", engine({
    defaultLayout: "main",
    helpers: {
      json: (context) => JSON.stringify(context)
    },
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    }
  }));
  
// Serve arquivos estáticos a partir da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

//configurando o body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração da sessão
app.use(session({
    secret: 'gerenciamentoDeDinheiroSecretPassword123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

//pegando as rotas pasta somente para rotas
app.use(router)


//porta
app.listen(8080);