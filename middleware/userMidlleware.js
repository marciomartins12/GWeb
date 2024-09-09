function userMiddleware(req, res, next) {
    if (req.session.user && req.session.user.email) {
        return next();
    } else {
        res.render("login", {mensagem : "precisa entrar com sua conta"});
    }
}
module.exports = userMiddleware;