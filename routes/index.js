var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Crisviga' });
});

/* GET crisviga page. */
router.get('/about', function(req, res, next) {
  res.render('crisviga', { title: 'Acerca de suver' });
});

module.exports = router;
