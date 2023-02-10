const assert = require("assert");
const { db } = require("../index");

// GET ALL
// données en entrée
// -> rien
// données attendues
// -> Article[]
// données obtenues
// -> Article[] === req.data.dbArticle

// POST Article
// données en entrée
// -> {Article}
// données attendues
// -> { insertId, ... }
// données obtenues
// -> { insertId, ... } === req.data.article

// POST -> GET* -> GETID -> (test jointure) -> UPDATE -> DELETE

describe("MOCHA // CRUD // Comments", () => {
    let user, comment
    let article = { id_article: 72 }

    ////// POST User
    it("POST // User", (done) => {
        let sql = `INSERT INTO users
            (firstname,lastname,email,password,username) 
        VALUES
            ("Obi-Wan","Kenobi","SW@gmail.com","@test","Obi-Two");`

        db.query(sql, (err, data) => {
            if (err) throw err
            console.log('POST', typeof data, data);
            user = data
            done(assert.equal(typeof data.insertId, 'number'))
        })
    })

    //// POST Comment
    it("POST // Comment ", (done) => {
        let sql = `
            INSERT INTO comments 
                (id_article,content, id_user)
            VALUES 
                (315162,'Bon gros commentaire', ${user.insertId});`

        db.query(sql, (err, data) => {
            if (err) throw err;
            console.log('POST', typeof data, data)
            comment = data
            done(assert.equal(typeof data.insertId, 'number'))
        })
    })

    ////// PUT Comment
    it("PUT // Comment", (done) => {
        const content = "Bon gros commentaire le retour"
        let sql = `UPDATE comments SET content = '${content}' WHERE id_comment = ${comment.insertId};`
        db.query(sql, (err, data) => {
            if (err) throw err
            console.log('PUT', typeof data, data)
            db.query(`SELECT * FROM comments WHERE id_comment = ${comment.insertId};`, (err, data) => {
                if (err) throw err
                console.log('SELECT', typeof data, data)
                done(assert.equal(data[0].content, `${content}`))
            })

        })
    })

    ////// POST Article
    it("POST // Article", (done) => {
        let sql = `
            INSERT INTO articles
                (id_article,title,release_date,overview,poster_path,type,id_user)
            VALUES
                (${article.id_article},'test',DATE'1993-11-03','test','/test','movie',1);`
        db.query(sql, (err, data) => {
            if (err) throw err
            console.log('POST', typeof data, data)
            db.query(`SELECT * FROM articles WHERE id_article=${article.id_article};`, (err, data) => {
                if (err) throw err
                console.log('SELECT', typeof data, data)
                done(assert.equal(typeof data, typeof []))
            })
        })
    })

    ////// PUT Article
    it("PUT // Article", (done) => {
        const content = "test encore"
        let sql = `UPDATE articles SET title = '${content}' WHERE id_article = ${article.id_article};`
        db.query(sql, (err, data) => {
            if (err) throw err
            console.log('PUT', typeof data, data)
            db.query(`SELECT * FROM articles WHERE id_article = ${article.id_article};`, (err, data) => {
                if (err) throw err
                console.log('SELECT', typeof data, data)
                done(assert.equal(data[0].title, `${content}`))
            })

        })
    })

    ///// GET Articles
    it("GET // Articles", (done) => {
        let sql = `SELECT * FROM articles WHERE id_article=${article.id_article};`
        db.query(sql, (err, data) => {
            if (err) throw err
            console.log('GET', typeof data, data)
            done(assert.equal(typeof data, typeof []))
        })
    })

    ////// POST Like 
    it("POST // Like ", (done) => {
        let sql = `
            INSERT INTO likes 
                (id_user,id_article,is_liked)
            VALUES 
                (${user.insertId},315162,1);`
        db.query(sql, (err, data) => {
            if (err) throw err;
            console.log('POST', typeof data, data)
            db.query(`SELECT * FROM likes WHERE id_user=${user.insertId} AND id_article=315162;`, (err, data) => {
                if (err) throw err
                console.log('SELECT', typeof data, data)
                done(assert.equal(typeof data, typeof []))
            })
        })
    })

    ////// DELETE article
    it("DELETE // Article", (done) => {
        let sql = `DELETE FROM articles WHERE id_article=${article.id_article};`
        db.query(sql, (err, data) => {
            if (err) throw err
            console.log('DELETE', typeof data, data)
            db.query(`SELECT * FROM articles WHERE id_article=${article.id_article};`, (err, data) => {
                if (err) throw err
                console.log('SELECT', typeof data, data)
                done(assert.equal(data.length, 0))
            })
        })
    })

    ////// DELETE User
    it("DELETE // User", (done) => {
        let sql = `DELETE FROM users WHERE id_user=${user.insertId};`
        db.query(sql, (err, data) => {
            if (err) throw err
            console.log('DELETE', typeof data, data);
            db.query(`SELECT * FROM users WHERE id_user=${user.insertId};`, (err, data) => {
                if (err) throw err
                console.log('SELECT', typeof data, data);
                done(assert.equal(data.length, 0))
            })

        })
    })

    ////// CHECK ON CASCADE
    it("CHECK ON CASCADE // Comment", (done) => {
        let sql = `SELECT * FROM comments WHERE id_user=${user.insertId};`
        db.query(sql, (err, data) => {
            if (err) throw err
            console.log('SELECT', typeof data, data)
            done(assert.equal(data.length, 0))
        })
    })

    it("CHECK ON CASCADE // Like", (done) => {
        let sql = `SELECT * FROM likes WHERE id_user=${user.insertId};`
        db.query(sql, (err, data) => {
            if (err) throw err
            console.log('SELECT', typeof data, data)
            done(assert.equal(data.length, 0))
        })
    })
})