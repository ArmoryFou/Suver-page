var express = require('express');
var router = express.Router();
var bcryptjs = require("bcryptjs");
const connection = require("../database/db.js");
const jf = require("../json/demonlist.json")
const ju = require("../json/records.json")

/* GET top 1 page. */
router.get('/1', function(req, res, next) {
 
    res.render('Demonlist/1', {
      Demonlist: jf.Demonlist,
      Records: ju.Records
    });
  });

/* GET top 1 page. */
router.get('/2', function(req, res, next) {
 
  res.render('Demonlist/2', {
    Demonlist: jf.Demonlist,
    Records: ju.Records
  });
});

/* GET top 3 page. */
router.get('/3', function(req, res, next) {
 
  res.render('Demonlist/3', {
    Demonlist: jf.Demonlist,
    Records: ju.Records
  });
});

/* GET top 4 page. */
router.get('/4', function(req, res, next) {
 
  res.render('Demonlist/4', {
    Demonlist: jf.Demonlist,
    Records: ju.Records
  });
});

/* GET top 5 page. */
router.get('/5', function(req, res, next) {
 
  res.render('Demonlist/5', {
    Demonlist: jf.Demonlist,
    Records: ju.Records
  });
});

/* GET top 6 page. */
router.get('/6', function(req, res, next) {
 
  res.render('Demonlist/6', {
    Demonlist: jf.Demonlist,
    Records: ju.Records
  });
});

/* GET top 7 page. */
router.get('/7', function(req, res, next) {
 
  res.render('Demonlist/7', {
    Demonlist: jf.Demonlist,
    Records: ju.Records
  });
});

/* GET top 8 page. */
router.get('/8', function(req, res, next) {
 
  res.render('Demonlist/8', {
    Demonlist: jf.Demonlist,
    Records: ju.Records
  });
});

/* GET top 9 page. */
router.get('/9', function(req, res, next) {
 
  res.render('Demonlist/9', {
    Demonlist: jf.Demonlist,
    Records: ju.Records
  });
});

/* GET top 10 page. */
router.get('/10', function(req, res, next) {
 
  res.render('Demonlist/10', {
    Demonlist: jf.Demonlist,
    Records: ju.Records
  });
});
  
  module.exports = router;