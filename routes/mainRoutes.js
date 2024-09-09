const express = require("express");
const Sequelize = require('sequelize');
const router = express.Router();
const userMiddleware = require("../middleware/userMidlleware");



router.get("/", (req, res)=>{
    res.render("homePageDespesas")
})

router.get("/adicionarDespesa", (req, res) => {
    res.render("adicionarDespesa");
})




router.get("/receita", (req, res)=>{
    res.render("homePageReceita");
})



module.exports = router;

