const mysql = require("mysql");
const { configDB } = require('./dbConfig')

// Création de la connection avec les paramètres donner
db = mysql.createConnection(configDB);

// Config ASYNC
const util = require("util");
db.query = util.promisify(db.query).bind(db);

// Connexion de la db mysql
db.connect((err) => {
    if (err) console.error('error connecting: ', err.stack);
    console.log('connected as id ', db.threadId);
});

module.exports = { db }