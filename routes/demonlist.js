var express = require("express");
var router = express.Router();
var bcryptjs = require("bcryptjs");
const connection = require("../database/db.js");
const jf = require("../json/demonlist.json");
const ju = require("../json/records.json");

// GET demonlist page
router.get("/:demonlistNumber", function (req, res, next) {
  // Extract the demonlist number from the URL parameters
  const demonlistNumber = req.params.demonlistNumber;

  // Check if user is logged in
  const loggedIn = req.session.loggedin;

  // Render the appropriate page based on the demonlist number
  res.render(`Demonlist/DemonlistPage`, {
    login: loggedIn,
    name: loggedIn ? req.session.name : "Login",
    Demonlist: jf.Demonlist,
    Records: ju.Records,
    demonListNumber: demonlistNumber
  });
});


module.exports = router;
