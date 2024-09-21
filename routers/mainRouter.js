const express = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Router = express.Router();
const userModel = require("../models/user");
const postModel = require("../models/post")
const userAuthenticate = require("../middlewares/userAuthenticate")
const uploadMultiple = upload.fields([
    { name: 'imagem', maxCount: 1 },
]);




Router.get("/", userAuthenticate, (req, res) => {
    res.render("home");
});

Router.get("/login", (req, res) => {
    res.render("login");
});

Router.get("/newPost", userAuthenticate, (req, res) => {
    res.render("newPost");
})




Router.post("/enviandoNewPost", userAuthenticate, uploadMultiple, async (req, res) => {
    const imagem = req.files['imagem'] ? req.files['imagem'][0].buffer : null;
    const dataAtual = new Date().toISOString().slice(0, 10);
    const { legenda } = req.body;
    try {
        await postModel.create({
            user_id: 1,
            legenda: legenda,
            imagem_post: imagem,
            data_post: dataAtual
        })
        res.redirect("/")
    } catch (error) {
        console.log(error)
    }
})

Router.post("/tryLogin", async (req, res) => {

    const { email, senha } = req.body;

    try {
        userModel.findOne({
            where: { email: email, senha: senha }
        }).then((conta) => {

            req.session.user = {
                id: conta.iduser,
                email: conta.email,
            }

            res.redirect("/")
        }).catch(err => console.log(err))

    } catch (error) {
        console.log(error)
    }
})

module.exports = Router