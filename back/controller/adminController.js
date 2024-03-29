
exports.pageAdmin = async function (req, res) {
    const articles = await db.query(`SELECT * FROM articles`);
    const users = await db.query(`SELECT * FROM users`);
    const comments = await db.query(`SELECT id_comment,content,username,comments.updated_at FROM comments INNER JOIN users ON comments.id_user=users.id_user WHERE is_reported=1`);
    res.render("pages/admin", { articles, users, comments, layout: "layout_admin" })
}

exports.createArticle = async function (req, res) {
    const { id_article, title, release_date, overview, poster_path, type } = req.body
    await db.query(`INSERT INTO articles (id_article, title, release_date, overview, poster_path, id_user,type) VALUES ('${id_article}','${title}', DATE '${release_date}', '${overview}', '${poster_path}','${type}');`);
    res.redirect('back')
}

exports.updateArticle = async function (req, res) {
    const { title, overview, id_article } = req.body
    await db.query(`UPDATE articles SET title="${title}",overview = "${overview}" WHERE id_article = ${id_article};`);
    res.redirect('back')
}

exports.deleteArticle = async function (req, res) {
    const { id } = req.params
    await db.query(`DELETE FROM articles WHERE id_article=${id};`);
    res.redirect('back')
}
exports.releaseComment = async function (req, res) {
    const { id } = req.params
    await db.query(`UPDATE comments SET is_reported=0 WHERE id_comment = ${id};`);
    res.redirect('back')
}
exports.banUser = async function (req, res) {
    const { id } = req.params
    const [data] = await db.query(`SELECT * FROM users WHERE id_user=${id}`)
    if(!data) res.render('pages/home',{flash : "l'utilisateur n'éxiste pas !"})
    else if (data.username === 'RhoFormeur') res.render('pages/admin', { flash: 'Vous ne pouvez pas bannir le fondateur !' })
    else if (data.is_ban === 1){
        await db.query(`UPDATE users SET is_ban=0 WHERE id_user=${id}`);
        res.redirect('back')
    } else if (data.is_ban === 0){
        await db.query(`UPDATE users SET is_ban=1 WHERE id_user=${id}`);
        res.redirect('back')
    }
}