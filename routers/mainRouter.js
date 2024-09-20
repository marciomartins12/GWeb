const express = require("express");
const Router = express.Router();
const userModel = require("../models/user");
const postModel = require("../models/post")
const userAuthenticate = require("../middlewares/userAuthenticate")

Router.get("/",userAuthenticate ,(req, res) => {

    res.render("home");
});

Router.get("/login", (req, res) => {
    res.render("login");
});

Router.get("/newPost", (req, res)=>{
    res.render("newPost");
})









Router.post("enviandoNewPost", async(req,res)=>{
await 
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
      console.log(error)  
    }
})

module.exports = Router