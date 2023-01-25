require("dotenv").config();
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

// Première route
app.get("/", (req, res) => {
    res.render("pages/home")
})

// Deuxième route
app.get("/profil", (req, res) => {
    res.render("pages/profil", { layout: 'layout_user' })
})

// Troisième route
app.get("/films", (req, res) => {
    db.query(`SELECT * FROM articles`, function (err, data) {
        if (err) throw err;
        // Rendu de la page films avec les data de la requête SQL précédente
        res.render("pages/films", { data })
    })
})

app.get(`/films/:id`, async (req, res) => {
    const { id } = req.params
    const data = await db.query(`SELECT * FROM articles WHERE id_article=${id}`)
    const comments = await db.query(`SELECT comments.content, comments.created_at, users.username FROM comments INNER JOIN users ON comments.id_user=users.id_user WHERE id_article=${id}`)
    res.render("pages/fiche_article", { data:data[0], comments})
})

// Quatrième route
app.get("/series", (req, res) => {
    db.query(`SELECT * FROM articles`, function (err, data) {
        if (err) throw err;
        // Rendu de la page films avec les data de la requête SQL précédente
        res.render("pages/films", { data })
    })
});

// Cinquième route
app.get("/animes", (req, res) => {
    db.query(`SELECT * FROM articles`, function (err, data) {
        if (err) throw err;
        // Rendu de la page films avec les data de la requête SQL précédente
        res.render("pages/films", { data })
    })
})

// Sixième route
app.get("/fiche_article", (req, res) => {
    res.render("pages/fiche_article")
})

// Septième route
app.get("/contact", (req, res) => {
    res.render("pages/contact")
})

// Admin page
app.get('/admin', async (req, res) => {
    const articles = await db.query(`SELECT * FROM articles`)
    const users = await db.query(`SELECT * FROM users`)
    res.render("pages/admin", { articles, users, layout: 'layout_admin' })
})

// POST ARTICLE - CREATE
app.post('/admin', (req, res) => {
    // Recuperation des données du formulaire
    const { id_article, title, release_date, overview, poster_path, id_user } = req.body
    console.log(req.body);
    db.query(`INSERT INTO articles (id_article, title, release_date, overview, poster_path, id_user) VALUES ('${id_article}','${title}', DATE '${release_date}', "${overview}", '${poster_path}','${id_user}');`, function (err, data) {
        if (err) throw err;

        // Redirection vers la page Admin
        res.redirect('back');
    })
})
// POST COMMENT - CREATE
app.post(`/films/:id`, (req,res) =>{
    const {content} = req.body
    const {id}=req.params
    db.query(`INSERT INTO comments (content,id_article,id_user) VALUES ("${content}",${id},1);`, function(err,data){
        if (err) throw err;
        // Redirection vers la page films/:id
        res.redirect('back')
    })
})
// 404 page
app.get("*", (req, res) => {
    res.render("pages/404")
})

// On demarre notre app en lui demandant d'être à l'écoute du port
app.listen(PORT_NODE, () =>
    console.log(`Server start on localhost:${PORT_NODE} 🚀`)
)
