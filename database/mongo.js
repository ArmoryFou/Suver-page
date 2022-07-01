const mongoose = require("mongoose");

const user = "ArmoryFour";
const password = "Armorymory4848games";
const db = "Suver";
const uri = `mongodb+srv://${user}:${password}@cluster0.zioea.mongodb.net/${db}?retryWrites=true&w=majority`;

const db2 = mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Base de datos conectada"))
  .catch((e) => console.log(e));