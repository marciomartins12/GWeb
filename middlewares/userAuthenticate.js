function userAuthenticate(req, res, next) {
    const user = req.session.user;
    if (user.email && user.id) {
        next()
    } else {
        res.redirect("/login")
    }
}

module.exports = userAuthenticate