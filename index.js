const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const Router = require("./routers/mainRouter");
const session = require("express-session")
const path = require("path")



app.engine("handlebars", engine({
    defaultLayout: "main",
    helpers: {
        json: (context) => JSON.stringify(context)
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }
}));

app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended : true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'instagramSenha123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(Router)
app.listen(8080);