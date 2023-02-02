require("dotenv").config({ path: "./vars/.env" });
const mysql = require("mysql")
const express = require("express")
const { engine } = require("express-handlebars")
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// Déstructuration des variables d'environement (process.env)
const { DB_NAME, DB_HOST, DB_PASSWORD, DB_USER, PORT_NODE } = process.env;
const app = express()

/*
 * Configuration Handlebars
 ***************************/

// ! Import des helpers
const { limitArr, toUpper, formatDate, formatCommentDate } = require("./helper")

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
db.query = util.promisify(db.query).bind(db);

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

// Route Profil
app.route('/profil')
    .get((req, res) => {
        res.render("pages/profil", { layout: 'layout_user' })
    })

// Route Films
app.route('/films')
    .get(async (req, res) => {
        // const films = db.query(`SELECT * FROM articles WHERE type = "movie"`)
        db.query(`SELECT * FROM articles WHERE type = "movie"`, function (err, data) {
            if (err) throw err
            // Rendu de la page films avec les data de la requête SQL précédente
            res.render("pages/films", { data })
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
        const comments = await db.query(`SELECT comments.id_comment, comments.content, comments.updated_at, users.username FROM comments INNER JOIN users ON comments.id_user=users.id_user WHERE id_article=${id}`)
        const genres = await db.query(`SELECT id_article,name FROM articles_genres INNER JOIN genres ON genres.id_genre=articles_genres.id_genre WHERE id_article=${id}`)
        const likes = await db.query(`SELECT * FROM likes WHERE id_article=${id}`)
        res.render("pages/fiche_article", { data: data[0], comments, genres, likes })
    })
    // POST COMMENT
    .post((req, res) => {
        const { content } = req.body
        const { id } = req.params
        db.query(`INSERT INTO comments (content,id_article,id_user) VALUES ("${content}",${id},1);`, function (err, data) {
            if (err) throw err
            // Redirection vers la page Article/id
            res.redirect("back")
        })
    })
    // UDATE COMMENT
    .put((req, res) => {
        const { content,id_comment } = req.body
        console.log(req.body);
        db.query(`UPDATE comments SET content = "${content}" WHERE id_comment=${id_comment};`, function (err, data) {
            if (err) throw err
            // Redirection vers la page Article/id
            res.redirect("back")
        })
    })
    // DELETE COMMENT
    .delete((req, res) => {
        const { id_comment } = req.body
        console.log(req.body);
        db.query(`DELETE FROM comments WHERE id_comment=${id_comment};`, function (err, data) {
            if (err) throw err
            // Redirection vers la page Article/id
            res.redirect("back")
        })
    })


// Route Contact
app.route('/contact')
    .get((req, res) => {
        S
        res.render("pages/contact")
    })

// Route Admin
app.route('/admin')
    .get(async (req, res) => {
        const articles = await db.query(`SELECT * FROM articles`)
        const users = await db.query(`SELECT * FROM users`)
        const comments = await db.query(`SELECT id_comment,content,username,comments.updated_at FROM comments INNER JOIN users ON comments.id_user=users.id_user WHERE is_reported=1`)
        res.render("pages/admin", { articles, users, comments, layout: 'layout_admin' })
    })
    // POST ARTICLE - CREATE
    .post((req, res) => {
        // Recuperation des données du formulaire
        const { id_article, title, release_date, overview, poster_path, id_user } = req.body
        console.log(req.body);
        db.query(`INSERT INTO articles (id_article, title, release_date, overview, poster_path, id_user) VALUES ('${id_article}','${title}', DATE '${release_date}', "${overview}", '${poster_path}','${id_user}');`, function (err, data) {
            if (err) throw err;

            // Redirection vers la page Admin
            res.redirect('back');
        })
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
