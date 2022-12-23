const express = require("express");
const { engine } = require("express-handlebars");

const app = express();
const PORT_NODE = 3000;

/*
 * Configuration Handlebars
 ***************************/

// ! Import des helpers
const { limitArr, toUpper } = require("./helper");

app.engine("hbs", engine({
    // ! initialisation des helpers dans notre handlebars
    helpers: {
        limitArr,
        toUpper,
    },
    extname: "hbs",
    defaultLayout: "main",
})
);
app.set("view engine", "hbs");
app.set("views", "./views");

/*
 * Routes
 *********/
const arrTrend = [
    {
        id: 0,
        titre: "Avatar : La Voie de l'eau",
        poster:
            "https://image.tmdb.org/t/p/original/hYeB9GpFaT7ysabBoGG5rbo9mF4.jpg",
    },
    {
        id: 1,
        titre: "Mercredi",
        poster:
            "https://image.tmdb.org/t/p/original/9ifSmhXDP36tFZXdcczJzRDGo5b.jpg",
    },
    {
        id: 2,
        titre: "Black Adam",
        poster:
            "https://image.tmdb.org/t/p/original/hYALH5NPM7xk2XQd2J8wrfmliIW.jpg",
    },
    {
        id: 3,
        titre: "Pinocchio par Guillermo del Toro",
        poster:
            "https://image.tmdb.org/t/p/original/ftnEmnoHI5Znlzg0TwGcSMoXJt1.jpg",
    },
    {
        id: 4,
        titre: "Emancipation",
        poster:
            "https://image.tmdb.org/t/p/original/7VzVBcklUx4WiXFtutlOJZrBwY0.jpg",
    },
    {
        id: 5,
        titre: "Les Banshees d'Inisherin",
        poster:
            "https://image.tmdb.org/t/p/original/5Y0AINkH7xDqmuxJXUQdPbtyrub.jpg",
    },
    {
        id: 6,
        titre: "Troll",
        poster:
            "https://image.tmdb.org/t/p/original/9z4jRr43JdtU66P0iy8h18OyLql.jpg",
    },
    {
        id: 7,
        titre: "Les Gardiens de la Galaxie : Joyeuses Fêtes",
        poster:
            "https://image.tmdb.org/t/p/original/cF3E6CrCm3NUy5PDRBbGyXRChYb.jpg",
    },
    {
        id: 8,
        titre: "Avatar",
        poster:
            "https://image.tmdb.org/t/p/original/3npygfmEhqnmNTmDWhHLz1LPcbA.jpg",
    },
    {
        id: 9,
        titre: "Black Panther : Wakanda Forever",
        poster:
            "https://image.tmdb.org/t/p/original/rNTKgJdJ8tyfpiUug5ittECK8CS.jpg",
    },
    {
        id: 10,
        titre: "Bones and All",
        poster:
            "https://image.tmdb.org/t/p/original/fmjOEHYMQang2sMuM1fz5ddaEc2.jpg",
    },
    {
        id: 11,
        titre: "Willow",
        poster:
            "https://image.tmdb.org/t/p/original/jhdSPDlhswjN1r6O0pGP3ZvQgU8.jpg",
    },
    {
        id: 12,
        titre: "NANNY",
        poster:
            "https://image.tmdb.org/t/p/original/mPhXHRudGxsXIQq1WM6oVePkFIp.jpg",
    },
    {
        id: 13,
        titre: "Top Gun : Maverick",
        poster:
            "https://image.tmdb.org/t/p/original/kTh1s6I6yUyk2OGiRoGkDTYTS6K.jpg",
    },
    {
        id: 14,
        titre: "Trésors perdus : Le secret de Moctezuma",
        poster:
            "https://image.tmdb.org/t/p/original/j6UMjLEKcQDT7Ozvphh0r5QvWro.jpg",
    },
    {
        id: 15,
        titre: "La Nuit au Musée : Le retour de Kahmunrah",
        poster:
            "https://image.tmdb.org/t/p/original/zXwQGAx7jmbhpCJP3jcC9IUCBfd.jpg",
    },
    {
        id: 16,
        titre: "La Proie du Diable",
        poster:
            "https://image.tmdb.org/t/p/original/jZaug9eRUbYFT1PKWwD4CDRe8gO.jpg",
    },
    {
        id: 17,
        titre: "Smile",
        poster:
            "https://image.tmdb.org/t/p/original/3kbtoJw6ZN0UUQhSuiRbAatr2kV.jpg",
    },
    {
        id: 18,
        titre: "His Dark Materials : À la croisée des mondes",
        poster:
            "https://image.tmdb.org/t/p/original/yxkepbA5TFZkQ7ThRjbV08QXRCq.jpg",
    },
    {
        id: 19,
        titre: "The Fabelmans",
        poster:
            "https://image.tmdb.org/t/p/original/4HNGWeWe1w0KT8A829cU5uVVeWK.jpg",
    },
];

const arrUser = [
    { id: 0, username: "Bruno", role: "initié" },
    { id: 1, username: "Obi-Wan", role: "Maître de l'ordre" },
    { id: 2, username: "Maxime", role: "Grand Maître" },
    { id: 3, username: "Jean-Michel Apeupré", role: "initié" },
    { id: 4, username: "Olivier de Carglass", role: "initié" },
    { id: 5, username: "Olivier de la Milice", role: "initié" },
    { id: 6, username: "Freezer", role: "initié" },
    { id: 7, username: "Marie-Thérèse", role: "initié" },
]
// Première route
app.get("/", (req, res) => {
    res.render("pages/home", {
        layout: "home",
    });
});

// Deuxième route
app.get("/profil", (req, res) => {
    res.render("pages/profil");
});

// Troisième route
app.get("/films", (req, res) => {
    res.render("pages/films", { list: arrTrend });
});

app.get(`/films/:id`, (req, res) => {
    console.log(`route film/id`, req.params.id);
    const article = arrTrend.filter((arrTrend) => arrTrend.id == req.params.id);
    console.log(article);
    if (!article[0]) return res.redirect('/')
    res.render("pages/fiche-article", { article: article[0] });
});

// Quatrième route
app.get("/series", (req, res) => {
    res.render("pages/series", { list: arrTrend });
});

// Cinquième route
app.get("/animes", (req, res) => {
    res.render("pages/animes", { list: arrTrend });
});

// Sixième route
app.get("/fiche-article", (req, res) => {
    res.render("pages/fiche-article");
});

// Septième route
app.get("/contact", (req, res) => {
    res.render("pages/contact");
});

// Admin page
app.get('/admin', (req, res) => {
    res.render('pages/admin', { list: arrTrend, user: arrUser });
});

// 404 page
app.get("*", (req, res) => {
    res.render("pages/404")
});

// On demarre notre app en lui demandant d'être à l'écoute du port
app.listen(PORT_NODE, () =>
    console.log(`Server start on localhost:${PORT_NODE} 🚀`)
);
