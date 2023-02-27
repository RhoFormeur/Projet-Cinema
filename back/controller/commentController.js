const { RenderArticle } = require('../utils/render')

exports.createComment = async function (req, res) {
    const { id } = req.params
    const { content } = req.body
    if (!content) return res.render('pages/fiche_article', {
        data: await RenderArticle(id),
        flash: "Vous devez remplir le champ de saisie !"
    })
    await db.query(`INSERT INTO comments (content,id_article,id_user) VALUES ("${content}",${id},${req.session.user.id});`);
    res.redirect('back')
}

exports.updateComment = async function (req, res) {
    const { id } = req.params
    const { content } = req.body

    const [data] = await db.query(`SELECT * FROM comments WHERE id_comment=${id};`);

    if (data && req.session.user) {
        if (req.session.user.id === data.id_user) {
            await db.query(`UPDATE comments SET content = "${content}" WHERE id_comment=${id};`);
            res.redirect('back')

        } else return res.render('pages/fiche_article', {
            data: await RenderArticle(data.id_article),
            flash: "Vous n'avez pas les droits !"
        })

    } else return res.render('pages/fiche_article', {
        data: await RenderArticle(data.id_article),
        flash: "Vous n'êtes pas connecté !"
    })
}

exports.reportComment = async function (req, res) {
    const { id } = req.params

    const [data] = await db.query(`SELECT * FROM comments WHERE id_comment=${id};`);

    if (data && req.session.user) {
        await db.query(`UPDATE comments SET is_reported = 1 WHERE id_comment=${id};`);
        res.redirect('back')

    } else return res.render('pages/fiche_article', {
        data: await RenderArticle(data.id_article),
        flash: "Vous n'êtes pas connecté !"
    })
}

exports.deleteComment = async function (req, res) {
    const { id } = req.params

    const [data] = await db.query(`SELECT * FROM comments WHERE id_comment=${id};`);

    if (data && req.session.user) {
        if (req.session.user.id === data.id_user) {
            await db.query(`DELETE FROM comments WHERE id_comment=${id};`);
            res.redirect('back')

        } else return res.render('pages/fiche_article', {
            data: await RenderArticle(data.id_article),
            flash: "Vous n'avez pas les droits !"
        })

    } else return res.render('pages/fiche_article', {
        data: await RenderArticle(data.id_article),
        flash: "Vous n'êtes pas connecté !"
    })
}