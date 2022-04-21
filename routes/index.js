var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Crisviga' });
});

/* GET crisviga page. */
router.get('/crisviga', function(req, res, next) {
  res.render('crisviga', { title: 'Crisviga' });
});

module.exports = router;
