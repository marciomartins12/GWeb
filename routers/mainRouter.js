const express = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage()});
const Router = express.Router();
const userModel = require("../models/user");
const postModel = require("../models/post");
const likeModel = require("../models/like");
const userAuthenticate = require("../middlewares/userAuthenticate");

const uploadMultiple = upload.fields([
    { name: 'imagem', maxCount: 1 },
]);



Router.get("/", userAuthenticate, async (req, res) => {

    const posts = await postModel.findAll()
    const postsFormatados = await Promise.all(posts.map(async (post) => {
        let contadorCurtidas = await likeModel.count({
            where: { post_id: post.idpost }
        })
        let user = await userModel.findByPk(post.user_id)
        return {
            ...post.dataValues,
            imagem_post: post.imagem_post ? `data:image/png;base64,${post.imagem_post.toString('base64')}` : null,
            likes: contadorCurtidas,
            user_post: user.nome,
            img_user: user.foto_perfil ? `data:imagem/png;base64,${user.foto_perfil.toString("base64")}` : null
        }
    }))
    res.render("home", { postsFormatados: postsFormatados });

});

Router.get("/login", (req, res) => {
    res.render("login");
});

Router.get("/newPost", userAuthenticate, (req, res) => {
    res.render("newPost");
})
Router.get("/perfil", userAuthenticate, (req, res)=>{
    res.render("perfil");
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
        console.log("error : ",error)
        res.send("erro ao enviar a imagem. ")
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