const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
const PORT_NODE = 3000;
/*
 * Configuration Handlebars 
 ***************************/

// ! Import des helpers
const { limit } = require('./helper')

app.engine('hbs', engine({
    // ! initialisation des helpers dans notre handlebars 
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

/*
 * Routes 
 *********/

// Première route
app.get('/', (req, res) => {
    res.render('home', {
        layout: "home"
    });
});

// Deuxième route
app.get('/profil', (req, res) => {
    res.render('profil');
});

// Troisième route
app.get('/films', (req, res) => {
    res.render('films');
});

// Quatrième route
app.get('/series', (req, res) => {
    res.render('series');
});

// Cinquième route
app.get('/animes', (req, res) => {
    res.render('animes');
});

// Sixième route
app.get('/fiche-article', (req, res) => {
    res.render('fiche-article');
});

// Septième route
app.get('/contact', (req, res) => {
    res.render('contact');
});

// // Admin page
// app.get('/admin', (req, res) => {
//     res.render('admin', {
//         layout: "admin",
//     });
// });

// On demarre notre app en lui demandant d'être à l'écoute du port
app.listen(PORT_NODE, () => console.log(`Server start on localhost:${PORT_NODE} 🚀`));