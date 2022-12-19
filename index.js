const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
const PORT_NODE = 3000;

/*
 * Configuration Handlebars 
 ***************************/

// ! Import des helpers
const { limitArr, toUpper } = require('./helper')

app.engine('hbs', engine({
    // ! initialisation des helpers dans notre handlebars
    helpers: {
        limitArr,
        toUpper
    },
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

/*
 * Routes 
 *********/
const arrTrend = [
    {
        titre: "Avatar : La Voie de l'eau",
        poster: "https://image.tmdb.org/t/p/original/hYeB9GpFaT7ysabBoGG5rbo9mF4.jpg",
    },
    {
        titre: "Mercredi",
        poster: "https://image.tmdb.org/t/p/original/9ifSmhXDP36tFZXdcczJzRDGo5b.jpg",
    },
    {
        titre: "Black Adam",
        poster: "https://image.tmdb.org/t/p/original/hYALH5NPM7xk2XQd2J8wrfmliIW.jpg",
    },
    {
        titre: "Pinocchio par Guillermo del Toro",
        poster: "https://image.tmdb.org/t/p/original/ftnEmnoHI5Znlzg0TwGcSMoXJt1.jpg",
    },
    {
        titre: "Emancipation",
        poster: "https://image.tmdb.org/t/p/original/7VzVBcklUx4WiXFtutlOJZrBwY0.jpg",
    },
    {
        titre: "Les Banshees d'Inisherin",
        poster: "https://image.tmdb.org/t/p/original/5Y0AINkH7xDqmuxJXUQdPbtyrub.jpg",
    },
    {
        titre: "Troll",
        poster: "https://image.tmdb.org/t/p/original/9z4jRr43JdtU66P0iy8h18OyLql.jpg",
    },
    {
        titre: "Les Gardiens de la Galaxie : Joyeuses Fêtes",
        poster: "https://image.tmdb.org/t/p/original/cF3E6CrCm3NUy5PDRBbGyXRChYb.jpg",
    },
    {
        titre: "Avatar",
        poster: "https://image.tmdb.org/t/p/original/3npygfmEhqnmNTmDWhHLz1LPcbA.jpg",

    },
    {
        titre: "Black Panther : Wakanda Forever",
        poster: "https://image.tmdb.org/t/p/original/rNTKgJdJ8tyfpiUug5ittECK8CS.jpg",
    },
    {
        titre: "Bones and All",
        poster: "https://image.tmdb.org/t/p/original/fmjOEHYMQang2sMuM1fz5ddaEc2.jpg",
    },
    {
        titre: "Willow",
        poster: "https://image.tmdb.org/t/p/original/jhdSPDlhswjN1r6O0pGP3ZvQgU8.jpg",
    },
    {
        titre: "NANNY",
        poster: "https://image.tmdb.org/t/p/original/mPhXHRudGxsXIQq1WM6oVePkFIp.jpg",
    },
    {
        titre: "Top Gun : Maverick",
        poster: "https://image.tmdb.org/t/p/original/kTh1s6I6yUyk2OGiRoGkDTYTS6K.jpg",
    },
    {
        titre: "Trésors perdus : Le secret de Moctezuma",
        poster: "https://image.tmdb.org/t/p/original/j6UMjLEKcQDT7Ozvphh0r5QvWro.jpg",
    },
    {
        titre: "La Nuit au Musée : Le retour de Kahmunrah",
        poster: "https://image.tmdb.org/t/p/original/zXwQGAx7jmbhpCJP3jcC9IUCBfd.jpg",
    },
    {
        titre: "La Proie du Diable",
        poster: "https://image.tmdb.org/t/p/original/jZaug9eRUbYFT1PKWwD4CDRe8gO.jpg",
    },
    {
        titre: "Smile",
        poster: "https://image.tmdb.org/t/p/original/3kbtoJw6ZN0UUQhSuiRbAatr2kV.jpg",
    },
    {
        titre: "His Dark Materials : À la croisée des mondes",
        poster: "https://image.tmdb.org/t/p/original/yxkepbA5TFZkQ7ThRjbV08QXRCq.jpg",
    },
    {
        titre: "The Fabelmans",
        poster: "https://image.tmdb.org/t/p/original/4HNGWeWe1w0KT8A829cU5uVVeWK.jpg",
    }
]
// Première route
app.get('/', (req, res) => {
    res.render('home', {
        layout: "home",
    });
});

// Deuxième route
app.get('/profil', (req, res) => {
    res.render('profil');
});

// Troisième route
app.get('/films', (req, res) => {
    res.render('films', { list: arrTrend });
});

// Quatrième route
app.get('/series', (req, res) => {
    res.render('series', { list: arrTrend });
});

// Cinquième route
app.get('/animes', (req, res) => {
    res.render('animes', { list: arrTrend });
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