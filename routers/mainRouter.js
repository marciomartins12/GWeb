const express = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Router = express.Router();
const userModel = require("../models/user");
const postModel = require("../models/post");
const likeModel = require("../models/like");
const followerModel = require("../models/followers");
const userAuthenticate = require("../middlewares/userAuthenticate");

const uploadMultiple = upload.fields([
    { name: 'imagem', maxCount: 1 },
]);



Router.get("/", userAuthenticate, async (req, res) => {

    const posts = await postModel.findAll();
    const usuarioLogado = await userModel.findByPk(req.session.user.id)
    const imagem = usuarioLogado.foto_perfil ? `data:imagem/png;base64,${usuarioLogado.foto_perfil.toString("base64")}` : "/img/imagemPadrao.png"

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
            userId: user.iduser,
            img_user: user.foto_perfil ? `data:imagem/png;base64,${user.foto_perfil.toString("base64")}` : "/img/imagemPadrao.png"
        }
    }));

    if (postsFormatados[0]) {
        res.render("home", { postsFormatados: postsFormatados, imagem });
    } else {
        res.render("home", { mensagem: "<p class='mesangemF'>Nenhuma postagem foi encontrada.</p>" });
    }

});

Router.get("/login", (req, res) => {
    res.render("login");
});

Router.get("/createAccount", (req, res) => {
    res.render("createAccount")
});

Router.post("/creatingAccount", async (req, res) => {
    const dataAtual = new Date().toISOString().slice(0, 10)
    const { username, email, senha } = req.body;
    try {
        await userModel.create({
            nome: username,
            email: email,
            senha: senha,
            data_criacao: dataAtual,

        });
        res.redirect("/login")
    } catch (error) {
        console.log(error)
    }
})
Router.get("/newPost", userAuthenticate, (req, res) => {
    res.render("newPost");
});

Router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erro ao deslogar');
        }
        res.redirect('/login');
    });
});


Router.post("/enviandoNewPost", userAuthenticate, uploadMultiple, async (req, res) => {
    const imagem = req.files['imagem'] ? req.files['imagem'][0].buffer : null;
    const dataAtual = new Date().toISOString().slice(0, 10);

    const { legenda } = req.body;
    try {
        await postModel.create({
            user_id: req.session.user.id,
            legenda: legenda,
            imagem_post: imagem,
            data_post: dataAtual
        })
        res.redirect("/")
    } catch (error) {
        console.log(error)
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
        }).catch(err => { res.render("login", { mensagem: "<p class='mesangemF'>Email ou senha incorretos.</p>" }) })

    } catch (error) {
        console.log(error)
    }
})
Router.get("/post/:id", userAuthenticate, async (req, res) => {
    const post = await postModel.findByPk(req.params.id);

    if (post) {
        const user = await userModel.findByPk(post.user_id);

        const contadorCurtidas = await likeModel.count({ where: { post_id: post.idpost } })
        const postFormatado = {
            ...post.dataValues,
            imagem_post: `data:image/png;base64,${post.imagem_post.toString("base64")}`,
            likes: contadorCurtidas,
            user_post: user.nome,
            idusuario: user.iduser,
            img_user: user.foto_perfil ? `data:imagem/png;base64,${user.foto_perfil.toString("base64")}` : "/img/imagemPadrao.png"
        };

        res.render("viewPost", { postFormatado: postFormatado })
    } else {
        res.status(404).send('Postagem não encontrada');
    }

})
Router.get("/perfil", userAuthenticate, async (req, res) => {

    const countPosts = await postModel.count({ where: { user_id: req.session.user.id } });
    const countFollowing = await followerModel.count({ where: { seguidor_id: req.session.user.id } });
    const countFollower = await followerModel.count({ where: { user_id: req.session.user.id } });
    const usuarioLogado = await userModel.findByPk(req.session.user.id)
    const imagem = usuarioLogado.foto_perfil ? `data:imagem/png;base64,${usuarioLogado.foto_perfil.toString("base64")}` : "/img/imagemPadrao.png"

    const user = await userModel.findByPk(req.session.user.id);

    const postsUser = await postModel.findAll({ where: { user_id: req.session.user.id } })
    const postsFormatados = postsUser.map((post) => {

        return {
            ...post.dataValues,
            imagem_post: `data:imagem/png;base64,${post.imagem_post.toString("base64")}`

        }
    })

    res.render("perfil", { totalPost: countPosts, totalSeguindo: countFollowing, totalSeguidores: countFollower, userName: user.nome, bio: user.bio, posts: postsFormatados, imagem });
});

Router.get("/perfilUsuario/:id", userAuthenticate, async (req, res) => {
    const idUser = req.session.user.id;
    const contaSelecionada = req.params.id;

    if (idUser == contaSelecionada) {
        return res.redirect("/perfil")
    }
    const countPosts = await postModel.count({ where: { user_id: req.session.user.id } });
    const countFollowing = await followerModel.count({ where: { seguidor_id: req.session.user.id } });
    const countFollower = await followerModel.count({ where: { user_id: req.session.user.id } });
    const usuarioLogado = await userModel.findByPk(req.session.user.id)
    const imagem = usuarioLogado.foto_perfil ? `data:imagem/png;base64,${usuarioLogado.foto_perfil.toString("base64")}` : "/img/imagemPadrao.png"

    const user = await userModel.findByPk(req.session.user.id);

    const postsUser = await postModel.findAll({ where: { user_id: req.session.user.id } });
    const seguindoOrnot = await followerModel.findOne(
        { where: { user_id: contaSelecionada, seguidor_id: idUser } }
    )
    console.log(seguindoOrnot)
    const postsFormatados = postsUser.map((post) => {
        return {
            ...post.dataValues,
            imagem_post: `data:imagem/png;base64,${post.imagem_post.toString("base64")}`

        }
    })
    res.render("perfilUsuario", { totalPost: countPosts, totalSeguindo: countFollowing, totalSeguidores: countFollower, userName: user.nome, bio: user.bio, posts: postsFormatados, imagem, userid: user.iduser });
})



module.exports = Router