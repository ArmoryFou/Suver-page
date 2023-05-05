const mysql = require("mysql2");
const connection = mysql.createPool({
    host: "aws.connect.psdb.cloud",
    user: "g0evxnrt1b8buh13nxjt",
    password: "pscale_pw_1IHef7Fye9jRPc3slCDKC1EuwPkhMZ1NCag6gRSSrt9",
    database: "suver",
    ssl: {
        rejectUnauthorized: false
    }
});

    console.log("Conectado a la base de datos");

module.exports = connection;