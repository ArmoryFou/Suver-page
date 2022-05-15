const mysql = require("mysql2");
const connection = mysql.createPool({
    host: "0z1kgen1t3lm.us-east-4.psdb.cloud",
    user: "3ahjfi2p6oie",
    password: "pscale_pw_m2sNaWGvWFCBtTUx5kCEF4DUFPr9slz9Feg1J2Sa9Fw",
    database: "suver",
    ssl: {
        rejectUnauthorized: false
    }
});

    console.log("Conectado a la base de datos");

module.exports = connection;