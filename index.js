const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const Router = require("./routers/mainRouter");


app.engine("handlebar", engine({
    defaultLayout: "main", runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }
}))
app.set("view engine", "handlebras");

app.engine("handlebars", engine({
    defaultLayout: "main",
    helpers: {
        json: (context) => JSON.stringify(context)
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'ludovicensestudiositesenhasecreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use(Router)
app.listen(8080);