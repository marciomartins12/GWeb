const express = require("express");
const Sequelize = require('sequelize');
const router = express.Router();
const User = require("../models/user");
const Despesa = require("../models/despesa");
const Receita = require("../models/receita");

const userMiddleware = require("../middleware/userMidlleware");


router.get("/login", (req, res) => {
    res.render("login")
})
router.get("/", userMiddleware, async (req, res) => {
    const despesasEncontradas = await Despesa.findAll({
        where: { iduser: req.session.user.iduser },
        limit: 4
    })

    const aReceita = await Receita.findAll({
        where: { iduser: req.session.user.iduser }
    })
    const aDespesa = await Despesa.findAll({
        where: { iduser: req.session.user.iduser }
    })

    let sDespesa = aDespesa.reduce((total, despesa) => {
        return total + despesa.quantia;
    }, 0)


    let sReceita = aReceita.reduce((total, receita) => {
        return total + receita.quantia;
    }, 0)

  



    res.render("homePageDespesas", { listaDespesas: despesasEncontradas, totalDespesa : sDespesa, totalReceita : sReceita, total : sReceita - sDespesa });

})

router.get("/adicionarDespesa", userMiddleware, async(req, res) => {
    
    const aReceita = await Receita.findAll({
        where: { iduser: req.session.user.iduser }
    })
    const aDespesa = await Despesa.findAll({
        where: { iduser: req.session.user.iduser }
    })

    let sDespesa = aDespesa.reduce((total, despesa) => {
        return total + despesa.quantia;
    }, 0)


    let sReceita = aReceita.reduce((total, receita) => {
        return total + receita.quantia;
    }, 0)

    res.render("adicionarDespesa", { totalDespesa : sDespesa, totalReceita : sReceita, total : sReceita - sDespesa});
})

router.get("/adicionarReceita", userMiddleware, async(req, res) => {
    const aReceita = await Receita.findAll({
        where: { iduser: req.session.user.iduser }
    })
    const aDespesa = await Despesa.findAll({
        where: { iduser: req.session.user.iduser }
    })

    let sDespesa = aDespesa.reduce((total, despesa) => {
        return total + despesa.quantia;
    }, 0)


    let sReceita = aReceita.reduce((total, receita) => {
        return total + receita.quantia;
    }, 0)


    res.render("adicionarReceita",{totalDespesa : sDespesa, totalReceita : sReceita, total : sReceita - sDespesa });
})
router.get("/receita", userMiddleware, async (req, res) => {
    const receitasEncontradas = await Receita.findAll({
        where: { iduser: req.session.user.iduser },
        limit: 4
    })
    const aReceita = await Receita.findAll({
        where: { iduser: req.session.user.iduser }
    })
    const aDespesa = await Despesa.findAll({
        where: { iduser: req.session.user.iduser }
    })

    let sDespesa = aDespesa.reduce((total, despesa) => {
        return total + despesa.quantia;
    }, 0)


    let sReceita = aReceita.reduce((total, receita) => {
        return total + receita.quantia;
    }, 0)

    res.render("homePageReceita", { listaReceitas: receitasEncontradas, totalDespesa : sDespesa, totalReceita : sReceita, total : sReceita - sDespesa });
})


router.post("/adicionaDespesa", async (req, res) => {
    const { quantia, categoria, descricao } = req.body;
    try {

        await Despesa.create({
            quantia: quantia,
            categoria: categoria,
            descricao: descricao,
            iduser: req.session.user.iduser
        })
        res.redirect("/")

    } catch (error) {
        res.send(error)
    }

})
router.post("/adicionaReceita", async (req, res) => {
    const { quantia, categoria, descricao } = req.body;
    try {

        await Receita.create({
            quantia: quantia,
            categoria: categoria,
            descricao: descricao,
            iduser: req.session.user.iduser
        })
        res.redirect("/")

    } catch (error) {
        res.send(error)
    }

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


router.post("/cadastrar", async (req, res) => {
    try {
        const { nomec, emailc, senhac } = req.body;
        await User.create({
            email: emailc,
            senha: senhac,
            nome: nomec
        });
        res.redirect("/login")
    } catch (error) {
        console.log(error)
        res.send("erro ", error)
    }

})


module.exports = router;

