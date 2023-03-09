const path = require('path')
const fs = require('fs')
const { RenderArticle } = require("../utils/render")

exports.pageProfil = async function (req, res) {
    const films = await db.query(`SELECT title,is_liked,articles.id_article FROM articles INNER JOIN likes ON articles.id_article=likes.id_article WHERE type ='movie' AND likes.id_user=${req.session.user.id};`);
    const series = await db.query(`SELECT title,is_liked,articles.id_article FROM articles INNER JOIN likes ON articles.id_article=likes.id_article WHERE type ='serie' AND likes.id_user=${req.session.user.id};`);
    const animes = await db.query(`SELECT title,is_liked,articles.id_article FROM articles INNER JOIN likes ON articles.id_article=likes.id_article WHERE type ='anime' AND likes.id_user=${req.session.user.id};`);
    const [user] = await db.query(`SELECT * FROM users WHERE id_user=${req.session.user.id};`)
    res.render("pages/profil", { films, series, animes, user })
}

exports.editProfil = async function (req, res) {
    const { username, firstname, lastname, email, oldpassword, password, confirm } = req.body

    if (username || firstname || lastname || email) {
        await db.query(`UPDATE users SET username="${username}", firstname="${firstname}", lastname="${lastname}", email="${email}" WHERE id_user=${req.session.user.id};`);
        const [data] = await db.query(`SELECT * FROM users WHERE id_user=${req.session.user.id}`);

        req.session.user = {
            id: data.id_user,
            email: data.email,
            username: data.username,
            is_verified: data.is_verified,
            is_admin: data.is_admin
        }

        res.redirect('back')

    } else if (oldpassword && password && confirm) {
        const [data] = await db.query(`SELECT * FROM users WHERE id_user=${req.session.user.id};`);

        if (data.password = oldpassword && password == confirm) {
            const salt = 10
            bcrypt.hash(password, salt, async function (err, hash) {
                await db.query(`UPDATE users SET password="${hash}" WHERE id_user=${req.session.user.id};`);
                res.redirect('back')
            })
        } else res.redirect('back')

    } else if (req.file) {
        const [data] = await db.query(`SELECT image_user FROM users WHERE id_user=${req.session.user.id};`);

        if (data.image_user !== "default_icon.png") {
            pathImg = path.resolve("public/img/" + data.image_user)
            fs.unlink(pathImg, (err) => {
                if (err) throw err;
            })
        }
        await db.query(`UPDATE users SET image_user="${req.file.completed}" WHERE id_user=${req.session.user.id};`);
        res.redirect('back')
    }
}

exports.deleteProfil = async function (req, res) {
    const { id } = req.params
    await db.query(`DELETE FROM users WHERE id_user=${id};`)
    if (req.session.is_admin === 1) res.redirect('back')
    else {
        req.session.destroy(() => {
            res.clearCookie('screenmaze-cookie')
            res.render('pages/home', { flash: "Le compte a bien été supprimé !" })
        })
    }
}

exports.postLike = async function (req, res) {
    const { id } = req.params
    const { is_liked } = req.body
    await db.query(`INSERT INTO likes (id_article,id_user,is_liked)VALUES(${id},${req.session.user.id},${is_liked});`);
    res.render("pages/fiche_article", { data: await RenderArticle(id) })
}

exports.updateLike = async function (req, res) {
    const { id } = req.params
    const [data] = await db.query(`SELECT is_liked FROM likes WHERE id_article=${id} AND id_user=${req.session.user.id};`);
    if (data.is_liked === 0) {
        await db.query(`UPDATE likes SET is_liked = 1 WHERE id_article=${id} AND id_user=${req.session.user.id};`);
        res.render("pages/fiche_article", { data: await RenderArticle(id) })
    } else if (data.is_liked === 1) {
        await db.query(`UPDATE likes SET is_liked = 0 WHERE id_article=${id} AND id_user=${req.session.user.id};`);
        res.render("pages/fiche_article", { data: await RenderArticle(id) })
    }

}