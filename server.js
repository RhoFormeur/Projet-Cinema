require("dotenv").config({ path: "./vars/.env" })
const mysql = require("mysql")
const express = require("express")
const { engine } = require("express-handlebars")
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const { configDB } = require('./back/config/db/dbConfig')
const expressSession = require("express-session")
const MySQLStore = require("express-mysql-session")(expressSession)

// Déstructuration des variables d'environement (process.env)
const { PORT_NODE } = process.env
const app = express()

/*
 * Configuration Handlebars
 ***************************/

// ! Import des helpers
const { limitArr, toUpper, formatDate, formatCommentDate, checkComment } = require("./back/helper")

app.engine("hbs", engine({
    // ! initialisation des helpers dans notre handlebars
    helpers: {
        limitArr,
        toUpper,
        formatDate,
        formatCommentDate,
        checkComment,
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
require('./back/config/db/dbConnect')

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

// Configuration Express-Session
const sessionStore = new MySQLStore(configDB);
app.use(
    expressSession({
        secret: "securite",
        name: "screenmaze-cookie",
        saveUninitialized: true,
        resave: false,
        store: sessionStore
    })
)

// Session Connexion for HBS
app.use('*', (req, res, next) => {
    console.log('SESSION : ', req.session)
    res.locals.user = req.session.user;
    next();
})

/*
 * Router de l'application
 *************************/
const ROUTER = require('./back/router')
app.use("/", ROUTER)


// On demarre notre app en lui demandant d'être à l'écoute du port
app.listen(PORT_NODE, () =>
    console.log(`Server start on localhost:${PORT_NODE} 🚀`)
)

module.exports = { db,app }
