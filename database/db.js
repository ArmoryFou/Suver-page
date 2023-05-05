const mysql = require("mysql2");
const connection = mysql.createPool({
    host: "aws.connect.psdb.cloud",
    user: "s3sxhxqerrv38np91pez",
    password: "pscale_pw_p5i4aNqO8B0nfwlgcS0QWLD6MnxtWGbooUxpuwCvclC",
    database: "suver",
    ssl: {
        rejectUnauthorized: false
    }
});

    console.log("Conectado a la base de datos");

module.exports = connection;