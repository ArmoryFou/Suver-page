var express = require('express');
var router = express.Router();
var bcryptjs = require("bcryptjs");
const connection = require("../database/db.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Crisviga' });
});

/* GET crisviga page. */
router.get('/bestmoments', function(req, res, next) {
  res.render('crisviga', { title: 'Best moments' });
});

/* GET ooc page. */
router.get('/ooc', function(req, res, next) {
  res.render('ooc', { title: 'Out of context' });
});

/* GET demonlist page. */
router.get('/demonlist', function(req, res, next) {
  res.render('demonlist', { title: 'Demonlist de Suver' });
});

/* GET demonlist page. */
router.get('/demonlist', function(req, res, next) {
  res.render('demonlist', { title: 'Demonlist de Suver' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post("/register", async (req, res, next) =>{
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordush = await bcryptjs.hash(pass, 8);
  connection.query("INSERT INTO users SET ?", {user: user, pass:passwordush}, async(error, results) => {
    if(error){
      console.log(error);
    } else{
      res.render("registerDone", {name: user});
    }
  });
});

/* GET login page. */
router.get('/articles/armorypage', function(req, res, next) {
  res.render('articles/ArmoryPage', { title: 'ArmoryPage' });
});

module.exports = router;
