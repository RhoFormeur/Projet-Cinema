const { RenderArticle } = require("../utils/render")

// Mise en place d'une requete preparé pour se premunire contre les injections SQL dans nodejs
exports.pageFilms = async function (req, res) {
    const movie = "movie";
    const data = await db.query(`SELECT * FROM articles WHERE type = ?`, [movie]);
    res.render('pages/articles', { data })

}

exports.pageSeries = async function (req, res) {
    const data = await db.query(`SELECT * FROM articles WHERE type = "serie"`);
    res.render('pages/articles', { data })
}

exports.pageAnimes = async function (req, res) {
    const data = await db.query(`SELECT * FROM articles WHERE type = "movie"`);
    res.render('pages/articles', { data })
}

exports.pageArticle = async function (req, res) {
    const { id } = req.params
    res.render("pages/fiche_article", { data: await RenderArticle(id) })
}