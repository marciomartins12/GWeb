const express = require("express");
const Sequelize = require('sequelize');
const router = express.Router();
const User = require("../models/user");
const userMiddleware = require("../middleware/userMidlleware");


router.get("/login", (req, res) => {
    res.render("login")
})
router.post("/logar", async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuarioEncontrado = await User.findOne({
            where: { email: email }
        })

        if (usuarioEncontrado && usuarioEncontrado.senha == senha) {
            req.session.user = {
                iduser: usuarioEncontrado.iduser,
                email: usuarioEncontrado.email,
                nome: usuarioEncontrado.nome
            }
        }
        res.redirect("/receita");

    } catch (error) {
        res.send("erro no servidor : " + error)
    }
})


router.post("/cadastrar", async (req, res)=>{
    try {
        const {nomec, emailc, senhac} = req.body;
        await User.create({
            email : emailc,
            senha : senhac,
            nome : nomec
        });
        res.redirect("login")
    } catch (error) {
        console.log(error)
        res.send("erro ", error)
    }

})

router.get("/", userMiddleware, (req, res) => {
    res.render("homePageDespesas")
})

router.get("/adicionarDespesa", userMiddleware, (req, res) => {
    res.render("adicionarDespesa");
})

router.get("/adicionarReceita", userMiddleware, (req, res) => {
    res.render("adicionarReceita");
})

router.get("/receita", userMiddleware, (req, res) => {
    res.render("homePageReceita");
})



module.exports = router;

