require("dotenv").config({ path: "./vars/.env" })
const mysql = require("mysql")
const express = require("express")
const { engine } = require("express-handlebars")
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const { mailSend } = require("./back/config/other/nodeMailer")
const upload = require('./back/config/other/multer')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')

// Déstructuration des variables d'environement (process.env)
const { DB_NAME, DB_HOST, DB_PASSWORD, DB_USER, PORT_NODE } = process.env
const app = express()

/*
 * Configuration Handlebars
 ***************************/

// ! Import des helpers
const { limitArr, toUpper, formatDate, formatCommentDate } = require("./back/helper")

app.engine("hbs", engine({
    // ! initialisation des helpers dans notre handlebars
    helpers: {
        limitArr,
        toUpper,
        formatDate,
        formatCommentDate,
    },
    extname: "hbs",
    defaultLayout: "layout_main",
})
)
app.set("view engine", "hbs")
app.set("views", "./views")

/*
* Config mysql
***************/
let configDB = {
    host: DB_HOST, // localhost
    user: DB_USER, // user
    password: DB_PASSWORD, // password
    database: DB_NAME // nameDatabase
};

// Création de la connection avec les paramètres dans config.js
db = mysql.createConnection(configDB)

// ! Config ASYNC
const util = require("util");
db.query = util.promisify(db.query).bind(db)

// Connexion a la db mysql
db.connect((err) => {
    if (err) console.error("error connecting: " + err.stack)
    console.log("connected as id " + db.threadId)
})


/*
 * Config method override 
 *************************/
// Permet de transformer une requete POST en requete PUT ou DELETE
app.use(methodOverride('_method'))

/*
 * Config Body-parser
 *********************/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

/*
 * Configuration de la route vers notre dossier static
 ******************************************************/
app.use("/assets", express.static('public'))

// Import des middlewares
const { isAdmin } = require('./middleware');

/*
 * Routes
 *********/

// Route Home
app.route('/')
    .get((req, res) => {
        res.render("pages/home")
    })
    .post(async (req, res) => {
        const { username, password, email, confirm } = req.body
        const salt = 10
        if (username && email && password == confirm) {
            bcrypt.hash(password, salt, function (err, hash) {
                // Store hash in your password DB.
                db.query(`INSERT INTO users (username,password,email) VALUES ('${username}','${hash}','${email}');`, function (err, data) {
                    if (err) throw err
                    else {
                        mailSend(`ScreenMaze <${process.env.MAIL_USER}>`, `${data.username} <${email}>`, `Confirmer votre email`, `Cliquez sur le lien ci-dessous pour confirmer votre email`, async function (err, info) {
                            if (err) throw err
                            console.log(info);
                            res.render("pages/mail_confirm")
                        })
                    }
                })
            })
        } else if (username && password && !email && !confirm) {
            db.query(`SELECT * FROM users WHERE username='${username}';`, function (err, data) {
                console.log(data);
                if (err) throw err
                else if (!data) res.render('pages/no_account')
                else {
                    bcrypt.compare(password, data[0].password, function (err, result) {
                        if (result == true) res.render('pages/profil')
                        else if (result == false) res.render('pages/404')
                    })
                }
            })
        } else if (email && !username && !password && !confirm) {
            db.query(`SELECT * FROM users WHERE email='${email}';`, function (err, data) {
                if (err) throw err
                else if (!data) res.render('pages/no_account')
                else {
                    mailSend(`ScreenMaze <${process.env.MAIL_USER}>`, `${data.username} <${email}>`, `Modifier votre mot de passe`, `Cliquez sur le lien ci-dessous pour modifier votre mot de passe`, async function (err, info) {
                        if (err) throw err
                        else res.render('pages/mail_recup')
                    })
                }
            })
        } else res.render('pages/404')
    })

// Route Profil
app.route('/profil')
    // GET
    .get(async (req, res) => {
        const films = await db.query(`SELECT title,is_liked FROM articles INNER JOIN likes ON articles.id_article=likes.id_article WHERE type ='movie' AND likes.id_user=1;`)
        const series = await db.query(`SELECT title,is_liked FROM articles INNER JOIN likes ON articles.id_article=likes.id_article WHERE type ='serie' AND likes.id_user=1;`)
        const animes = await db.query(`SELECT title,is_liked FROM articles INNER JOIN likes ON articles.id_article=likes.id_article WHERE type ='anime' AND likes.id_user=1;`)
        const user = await db.query(`SELECT * FROM users WHERE id_user=1;`)
        res.render("pages/profil", { films, series, animes, user: user[0], layout: 'layout_user' })
    })
    // UPDATE USER & PASS
    .put(upload.single('image_user'), (req, res) => {
        const { username, firstname, lastname, email, oldpassword, password, confirm } = req.body
        if (username || firstname || lastname || email) {
            db.query(`UPDATE users SET username="${username}", firstname="${firstname}", lastname="${lastname}", email="${email}" WHERE id_user=1;`, function (err, data) {
                if (err) throw err
                else res.redirect('back')
            })
        } else if (oldpassword && password && confirm) {
            db.query(`SELECT * FROM users WHERE id_user=1;`, function (err, data) {
                if (err) throw err
                else if (data.password = oldpassword && password == confirm) {
                    db.query(`UPDATE users SET password="${password}" WHERE id_user=1;`, function (err, data) {
                        if (err) throw err
                        else res.redirect('back')
                    })
                }
            })
        } else if (req.file) {
            db.query(`SELECT image_user FROM users WHERE id_user=1;`, function (err, data) {
                if (err) throw err
                else if (data[0].image_user !== "default_icon.png") {
                    pathImg = path.resolve("public/img/" + data[0].image_user)
                    fs.unlink(pathImg, (err) => {
                        if (err) throw err;
                    })
                }
                db.query(`UPDATE users SET image_user="${req.file.completed}" WHERE id_user=1;`, function (err, data) {
                    if (err) throw err
                    else res.redirect('back')
                })
            })
        }
    })

    // DELETE USER
    .delete((req, res) => {
        const { id_user } = req.body
        db.query(`DELETE FROM users WHERE id_user=${id_user};`, function (err, data) {
            if (err) throw err
            else res.render('pages/home')
        })
    })

// Route Films
app.route('/films')
    .get((req, res) => {
        // const films = db.query(`SELECT * FROM articles WHERE type = "movie"`)
        db.query(`SELECT * FROM articles WHERE type = "movie"`, function (err, data) {
            if (err) throw err
            // Rendu de la page films avec les data de la requête SQL précédente
            if (process.env.MODE === 'test') res.json(data)
            else res.render("pages/films", { data })
        })
        // res.render("pages/films", { films })
    })

// Route Series
app.route('/series')
    .get((req, res) => {
        db.query(`SELECT * FROM articles WHERE type = "serie"`, function (err, data) {
            if (err) throw err;
            // Rendu de la page films avec les data de la requête SQL précédente
            res.render("pages/series", { data })
        })
    })

// Route Animes
app.route('/animes')
    .get((req, res) => {
        db.query(`SELECT * FROM articles`, function (err, data) {
            if (err) throw err
            // Rendu de la page films avec les data de la requête SQL précédente
            res.render("pages/films", { data })
        })
    })

// Route Fiche Article
app.route('/fiche_article')
    .get((req, res) => {
        res.render("pages/fiche_article")
    })

// Route Article/ID
app.route('/article/:id')
    // GET
    .get(async (req, res) => {
        const { id } = req.params
        const data = await db.query(`SELECT * FROM articles WHERE id_article=${id}`)
        const comments = await db.query(`SELECT id_comment,id_article,content, comments.updated_at,username FROM comments INNER JOIN users ON comments.id_user=users.id_user WHERE id_article=${id}`)
        const genres = await db.query(`SELECT id_article,name FROM articles_genres INNER JOIN genres ON genres.id_genre=articles_genres.id_genre WHERE id_article=${id}`)
        const likes = await db.query(`SELECT * FROM likes WHERE id_article=${id}`)
        if (process.env.MODE === 'test') res.json({ data, comments, genres, likes, id })
        else res.render("pages/fiche_article", { data: data[0], comments, genres, likes, id })
    })

    // POST COMMENT & LIKE
    .post((req, res) => {
        const { content, id_user, is_liked } = req.body
        const { id } = req.params
        if (process.env.MODE === 'test') {
            db.query(`INSERT INTO comments (content,id_article,id_user) VALUES ("${content}",${id},${id_user});`, function (err, data) {
                if (err) throw err
                res.json(data)
            })
        }
        if (is_liked) {
            db.query(`INSERT INTO likes (id_article,id_user,is_liked)VALUES(${id},1,${is_liked});`, function (err, data) {
                if (err) throw err
                res.redirect("back")
            })
        }
        else if (content) {
            db.query(`INSERT INTO comments (content,id_article,id_user) VALUES ("${content}",${id},1);`, function (err, data) {
                if (err) throw err
                // Redirection vers la page Article/id
                else res.redirect("back")
            })
        }
    })

    // UPDATE COMMENT & LIKE
    .put((req, res) => {
        const { content, is_liked, id_comment } = req.body
        console.log('req.body', content, is_liked, id_comment);
        const { id } = req.params
        if (is_liked) {
            db.query(`UPDATE likes SET is_liked = ${is_liked} WHERE id_article=${id} AND id_user=1;`, function (err, data) {
                if (err) throw err
                else res.redirect("back")
            })
        } else if (content && id_comment) {
            db.query(`UPDATE comments SET content = "${content}" WHERE id_comment=${id_comment};`, function (err, data) {
                if (err) throw err
                if (process.env.MODE === 'test') res.json(data)
                // Redirection vers la page Article/id
                else res.redirect("back")
            })
        } else if (!content && id_comment) {
            db.query(`UPDATE comments SET is_reported = 1 WHERE id_comment=${id_comment};`, function (err, data) {
                if (err) throw err
                if (process.env.MODE === 'test') res.json(data)
                // Redirection vers la page Article/id
                else res.redirect("back")
            })
        }
    })

    // DELETE COMMENT
    .delete((req, res) => {
        const { id_comment } = req.body
        db.query(`DELETE FROM comments WHERE id_comment=${id_comment};`, function (err, data) {
            if (err) throw err
            if (process.env.MODE === 'test') res.json(data)
            // Redirection vers la page Article/id
            else res.redirect("back")
        })
    })

// Route Contact
app.route('/contact')
    .get((req, res) => {
        res.render("pages/contact")
    })
    .post((req, res) => {
        const { name, content, sujet, email } = req.body;
        mailSend(`${name} <${email}>`, `Contact-ScreenMaze <${process.env.MAIL_USER}>`, sujet, `${content}<BR>${email}`, async function (err, info) {
            if (err) throw err
            console.log(info);
            res.redirect('/')
        })
    })

// Route Admin
app.route('/admin')
    .get(async (req, res) => {
        const articles = await db.query(`SELECT * FROM articles`)
        const users = await db.query(`SELECT * FROM users`)
        const comments = await db.query(`SELECT id_comment,content,username,comments.updated_at FROM comments INNER JOIN users ON comments.id_user=users.id_user WHERE is_reported=1`)
        if (process.env.MODE === 'test') res.json({ articles, users, comments, layout: 'admin' })
        else res.render("pages/admin", { articles, users, comments, layout: 'layout_admin' })
    })

    // POST ARTICLE
    .post((req, res) => {
        // Recuperation des données du formulaire
        const { id_article, title, release_date, overview, poster_path, id_user, type } = req.body
        db.query(`INSERT INTO articles (id_article, title, release_date, overview, poster_path, id_user,type) VALUES ('${id_article}','${title}', DATE '${release_date}', '${overview}', '${poster_path}','${id_user}','${type}');`, function (err, data) {
            if (err) throw err;

            if (process.env.MODE === 'test') res.json(data)
            // Redirection vers la page Admin
            else res.redirect('back');
        })
    })

    // UPDATE ARTICLE
    .put((req, res) => {
        const { title, overview, id_article, id_comment } = req.body
        if (!id_comment) {
            db.query(`UPDATE articles SET title="${title}",overview = "${overview}" WHERE id_article = ${id_article};`, function (err, data) {
                if (err) throw err

                if (process.env.MODE === 'test') res.json(data)
                // Redirection vers la page Admin
                else res.redirect('back')
            })
        } else if (id_comment) {
            db.query(`UPDATE comments SET is_reported=0 WHERE id_comment = ${id_comment};`, function (err, data) {
                if (err) throw err

                if (process.env.MODE === 'test') res.json(data)
                // Redirection vers la page Admin
                else res.redirect('back')
            })
        }
    })

    // DELETE ARTICLE & USER
    .delete((req, res) => {
        const { id_article, id_user, id_comment } = req.body
        if (id_article) {
            db.query(`DELETE FROM articles WHERE id_article=${id_article};`, function (err, data) {
                if (err) throw err

                if (process.env.MODE === 'test') res.json(data)
                // Redirection vers la page Admin
                else res.redirect('back')
            })
        } else if (id_user) {
            db.query(`DELETE FROM users WHERE id_user=${id_user};`, function (err, data) {
                if (err) throw err

                if (process.env.MODE === 'test') res.json(data)
                // Redirection vers la page Admin
                else res.redirect('back')
            })
        } else if (id_comment) {
            db.query(`DELETE FROM comments WHERE id_comment=${id_comment};`, function (err, data) {
                if (err) throw err

                if (process.env.MODE === 'test') res.json(data)
                // Redirection vers la page Admin
                else res.redirect('back')
            })
        }

    })

// Route 404
app.route('*')
    .get((req, res) => {
        res.render("pages/404")
    })

// On demarre notre app en lui demandant d'être à l'écoute du port
app.listen(PORT_NODE, () =>
    console.log(`Server start on localhost:${PORT_NODE} 🚀`)
)

module.exports = { db, app }
