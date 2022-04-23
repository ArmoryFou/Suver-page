var express = require('express');
var router = express.Router();

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

module.exports = router;
