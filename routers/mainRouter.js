const express = require("express");
const Router = express.Router();
const userModel = require("../models/user");
const userAuthenticate = require("../middlewares/userAuthenticate")

Router.get("/", (req, res) => {
    res.send("home");
})

Router.get("/login", (req, res) => {
    res.render("login");
})




Router.post("/tryLogin", async(req, res)=>{
    const {email, senha } = req.body;

    try {
        userModel.findOne({
            where : {email : email, senha : senha}
        }).then((conta)=>{
            
            req.session.user = {
                id : conta.iduser,
                email : conta.email,
            }

            res.redirect("/")
        }).catch(err=>console.log(err))




    } catch (error) {
        
    }
})

module.exports = Router