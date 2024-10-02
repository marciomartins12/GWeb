const express = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Router = express.Router();
const userModel = require("../models/user");
const postModel = require("../models/post");
const likeModel = require("../models/like");
const followerModel = require("../models/followers");
const commentModel = require("../models/comment");
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
        const likeOrnot = await likeModel.findOne({ where: { post_id: post.idpost, user_id: req.session.user.id } });
        const lkn = likeOrnot ? `<svg class="ponto descurtir ${post.idpost}"  aria-label="Descurtir" class="x1lliihq x1n2onr6 xxk16z8" fill="currentColor" height="24" role="img" viewBox="0 0 48 48" width="24"><title>Descurtir</title><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>` : `<svg class="ponto curtir ${post.idpost}"  aria-label="Curtir" class="x1lliihq x1n2onr6 xyb1xck" fill="currentColor" height="24"
        role="img" viewBox="0 0 24 24" width="24">
        <title>Curtir</title>
        <path
            d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z">
        </path>
    </svg>` ;

        return {
            ...post.dataValues,
            imagem_post: post.imagem_post ? `data:image/png;base64,${post.imagem_post.toString('base64')}` : null,
            likes: contadorCurtidas,
            lkn: lkn,
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
        const likeOrNot = await likeModel.findOne({ where: { post_id: req.params.id, user_id: req.session.user.id } });
        const lkn = likeOrNot ? `<svg class="ponto descurtir"  aria-label="Descurtir" class="x1lliihq x1n2onr6 xxk16z8" fill="currentColor" height="24" role="img" viewBox="0 0 48 48" width="24"><title>Descurtir</title><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>` : `<svg class="ponto curtir" aria-label="Curtir" class="x1lliihq x1n2onr6 xyb1xck" fill="currentColor" height="24"
       role="img" viewBox="0 0 24 24" width="24">
       <title>Curtir</title>
       <path
           d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z">
       </path>
   </svg>` ;
        const contadorCurtidas = await likeModel.count({ where: { post_id: post.idpost } })
        const postFormatado = {
            ...post.dataValues,
            imagem_post: `data:image/png;base64,${post.imagem_post.toString("base64")}`,
            likes: contadorCurtidas,
            lkn: lkn,
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

    const countPosts = await postModel.count({ where: { user_id: contaSelecionada } });
    const countFollowing = await followerModel.count({ where: { seguidor_id: contaSelecionada } });
    const countFollower = await followerModel.count({ where: { user_id: contaSelecionada } });

    const usuarioLogado = await userModel.findByPk(req.session.user.id)
    const imagem = usuarioLogado.foto_perfil ? `data:imagem/png;base64,${usuarioLogado.foto_perfil.toString("base64")}` : "/img/imagemPadrao.png"

    const user = await userModel.findByPk(contaSelecionada);

    const postsUser = await postModel.findAll({ where: { user_id: contaSelecionada } });
    const seguindoOrnot = await followerModel.findOne(
        { where: { user_id: contaSelecionada, seguidor_id: idUser } }
    )
    let verifyfollower = seguindoOrnot ? "seguindo" : "seguir"

    const postsFormatados = postsUser.map((post) => {
        return {
            ...post.dataValues,
            imagem_post: `data:imagem/png;base64,${post.imagem_post.toString("base64")}`

        }
    })
    res.render("perfilUsuario", { totalPost: countPosts, totalSeguindo: countFollowing, totalSeguidores: countFollower, userName: user.nome, bio: user.bio, posts: postsFormatados, imagem, userid: user.iduser, verifyfollower });
})

Router.post("/unfollow/:id", userAuthenticate, async (req, res) => {
    const unfollow = req.params.id;
    const user = req.session.user.id;

    await followerModel.destroy({ where: { user_id: unfollow, seguidor_id: user } }).then(() => {
        res.redirect(`/perfilUsuario/${unfollow}`)
    }).catch((err) => console.log(err))

});

Router.post("/follow/:id", userAuthenticate, async (req, res) => {
    const follow = req.params.id;
    const user = req.session.user.id;
    const dataAtual = new Date().toISOString().slice(0, 10)
    await followerModel.create({
        user_id: follow,
        seguidor_id: user,
        data_follower: dataAtual
    }).then(() => res.redirect(`/perfilUsuario/${follow}`)).catch((err) => console.log(err))

});

Router.post("/deslike/:id", userAuthenticate, async (req, res) => {
    const idPost = req.params.id;
    const user = req.session.user.id;

    await likeModel.destroy({ where: { post_id: idPost, user_id: user } }).then(() => {
        res.redirect(`/post/${idPost}`);
    }).catch((er) => console.log(er))
})

Router.post("/like/:id", userAuthenticate, async (req, res) => {
    const idPost = req.params.id;
    const user = req.session.user.id;

    await likeModel.create({
        post_id: idPost,
        user_id: user
    }).then(() => res.redirect(`/post/${idPost}`)).catch((er) => console.log(er))
})

Router.get("/verComentarios/:id", userAuthenticate, async (req, res) => {
    const idPost = req.params.id;
    const comentarios = await commentModel.findAll({ where: { post_id: idPost } });
    if (comentarios) {
        const comentariosFormatados = comentarios.map(async (comentario) => {
            let usuarioComentou = await userAuthenticate.findByPk(comentario.user_id)
            let imagemUsuario = usuarioComentou.foto_perfil ? `data:imagem/png;base64,${usuarioComentou.foto_perfil.toString("base64")}` : "/img/imagemPadrao.png"
            return {
                ...comentario.dataValues,
                imagemUser: imagemUsuario,
                userName: usuarioComentou.nome
            }
        });
        res.render("viewComment", { comentariosFormatados});
    }
})

module.exports = Router