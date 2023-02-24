const { DB_NAME, DB_HOST, DB_PASSWORD, DB_USER } = process.env

let configDB = {
    host: DB_HOST, // localhost
    user: DB_USER, // user
    password: DB_PASSWORD, // password
    database: DB_NAME // nameDatabase
};

module.exports = { configDB }