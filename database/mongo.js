const mongoose = require("mongoose");
require("dotenv").config();

const user = process.env.USERMONGO;
const password = process.env.PASSWORDMONGO;
const db = process.env.DBMONGO;
const uri = `mongodb+srv://${user}:${password}@cluster0.zioea.mongodb.net/${db}?retryWrites=true&w=majority`;

const db2 = mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Base de datos conectada"))
  .catch((e) => console.log(e));