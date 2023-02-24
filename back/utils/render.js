exports.RenderArticle = async (id) => {
    // Ici on creer une promesse pour nous return un resultat (resolve) et en cas d'erreur l'err (reject)
    return new Promise(async (resolve, reject) => {
        try {
            const [article] = await db.query(`SELECT * FROM articles WHERE id_article=${id}`);
            const comments = await db.query(`SELECT id_comment,id_article,content, comments.updated_at,username FROM comments INNER JOIN users ON comments.id_user=users.id_user WHERE id_article=${id}`)
            const genres = await db.query(`SELECT id_article,name FROM articles_genres INNER JOIN genres ON genres.id_genre=articles_genres.id_genre WHERE id_article=${id}`)
            const likes = await db.query(`SELECT * FROM likes WHERE id_article=${id}`)
            // On renvoi les data
            resolve({
                article,
                comments,
                genres,
                likes
            })
        } catch (err) {
            // On renvoit l'err
            reject(err)
        }
    })
}