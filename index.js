const express = require("express");
const app = express();
const Router = require("./routers/mainRouter");
app.use(Router)





app.listen(8080);