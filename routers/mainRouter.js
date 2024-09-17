const express = require("express");
const Router = express.Router();
const userAuthenticate = require("../middlewares/userAuthenticate")

Router.get("/", (req, res) => {
    res.send("home");
})

Router.get("/login",userAuthenticate, (req, res) => {
    res.render("login");
})


module.exports = Router