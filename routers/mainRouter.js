const express = require("express");
const Router = express.Router();


Router.get("/", (req, res) => {
    res.send("home");
})

Router.get("/login", (req, res) => {
    res.send("login");
})


module.exports = Router