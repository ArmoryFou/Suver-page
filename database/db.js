const mysql = require("mysql2");
require("dotenv").config();
console.log(process.env.USERNAMESQL);
const connection = mysql.createPool({
    host: process.env.HOSTSQL,
    user: process.env.USERNAMESQL,
    password: process.env.PASSWORDSQL,
    database: process.env.DATABASESQL,
    ssl: {
        rejectUnauthorized: false
    }
});

    console.log("Conectado a la base de datos");

module.exports = connection;