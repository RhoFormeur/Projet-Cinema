const { RenderArticle } = require("../utils/render")

exports.pageFilms= async function(req,res){
    const data = await db.query(`SELECT * FROM articles WHERE type = "movie"`)
    if (!req.session.user) res.render('pages/films',{data})
    else if (req.session.user.is_admin === 1) res.render("pages/films", { data, layout: "layout_admin" })
    else res.render('pages/films', { data, layout: 'layout_user' })
    
}

exports.pageSeries= async function(req,res){
    const data = await db.query(`SELECT * FROM articles WHERE type = "serie"`)
    if (!req.session.user) res.render('pages/series',{data})
    else if (req.session.user.is_admin === 1) res.render("pages/series", { data, layout: "layout_admin" })
    else res.render('pages/series', { data, layout: 'layout_user' })
}

exports.pageAnimes= async function(req,res){
    const data = await db.query(`SELECT * FROM articles WHERE type = "movie"`)
    if (!req.session.user) res.render('pages/animes',{data})
    else if (req.session.user.is_admin === 1) res.render("pages/animes", { data, layout: "layout_admin" })
    else res.render('pages/animes', { data, layout: 'layout_user' })
}

exports.pageArticle=async function(req,res){
    const {id} = req.params
    if (!req.session.user) res.render('pages/fiche_article',{data: await RenderArticle(id)})
    else if (req.session.user.is_admin === 1) res.render("pages/fiche_article", { data: await RenderArticle(id), layout: "layout_admin" })
    else res.render("pages/fiche_article", { data: await RenderArticle(id), layout: "layout_user" })

}