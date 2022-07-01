var express = require("express");
var router = express.Router();
var bcryptjs = require("bcryptjs");
const connection = require("../database/db.js");
const db = require("../database/db");
const bodyparser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const Blog = require("../models/blogs");
const mongoose = require("mongoose");
const { Validator } = require("node-input-validator");
const db2 = require("../database/mongo");
const BlogComment=require('../models/blogComment');

const session = require("express-session");
router.use(
  session({
    secret: "Suver1234Crisvigo",
    resave: true,
    saveUninitialized: true,
  })
);

router.post("/register", async (req, res, next) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordush = await bcryptjs.hash(pass, 8);
  var defaultpp = "https://suver.herokuapp.com/images/default-pp.jpg"
  connection.query(
    "INSERT INTO users SET ?",
    { user: user, pass: passwordush, pp: defaultpp },
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        if (req.session.loggedin) {
          res.render("register", {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡YA PUEDES LOGGEARTE!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "",
            name: "Login",
            login: false,
          });
        } else {
          res.render("register", {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡YA PUEDES LOGGEARTE!",
            alertIcon: "success",
            showConfirmButton: true,
            timer: false,
            ruta: "",
            name: "Login",
            login: false,
          });
        }
      }
    }
  );
});

// Autenticacion

router.post("/auth", async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHash = await bcryptjs.hash(pass, 8);
  if (user && pass) {
    connection.query(
      "SELECT * FROM users WHERE user = ?",
      [user],
      async (error, results, fields) => {
        if (
          results.length == 0 ||
          !(await bcryptjs.compare(pass, results[0].pass))
        ) {
          res.render("login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "USUARIO y/o PASSWORD incorrectas",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "login",
            login: false,
            name: "Login",
          });
        } else {
          console.log(results[0]);
          req.session.loggedin = true;
          req.session.name = results[0].user;
          req.session.userid = results[0].id;
          console.log(req.session.userid);
          req.session.pp = results[0].pp;


          res.render("login", {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "",
            login: true,
            name: req.session.name,
            id: "profile",
          });
        }
        res.end();
      }
    );
  } else {
    res.send("Please enter user and Password!");
    res.end();
  }
});

// body-parser middleware use
router.use(bodyparser.json());
router.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

//! Use of Multer
var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./public/images/pps/"); // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
    const mimeExtension = {
      "image/jpeg": ".jpeg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
    };
    callBack(
      null,
      file.fieldname + "-" + Date.now() + mimeExtension[file.mimetype]
    );
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype);
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      req.fileError = "El formato no es valido";
    }
  },
});

//@type   POST
//route for post data
router.post("/loading", upload.single("image"), (req, res) => {
  if (!req.file) {
    console.log("No file upload");
  } else {
    console.log(req.file.filename);
    var imgsrc = "https://suver.herokuapp.com/images/pps/" + req.file.filename;
    var insertData = `UPDATE users SET pp = ? WHERE user = '${req.session.name}'`;
    db.query(insertData, [imgsrc], (err, results) => {
      if (err) throw err;
      console.log("file uploaded");
    });

    res.render("profile", {
      username: req.session.name,
      id: req.session.userid,
      ppimage: req.session.pp,
      edit: true,
      alert: true,
      alertTitle: "Foto cambiada",
      alertMessage: "¡La foto de perfil ha sido actualizada!",
      alertIcon: "success",
      showConfirmButton: false,
      timer: 1500,
      ruta: "profiles/profile",
    });
  }
});

router.get("/profiles/:id", async (req, res, next) => {
  console.log(req.session.userid);
  if (req.params.id == "profile") {
    var sql2 = `SELECT * FROM users WHERE id = '${[req.session.userid]}'`;
    db.query(sql2, function (err, data, fields) {
      if (err) throw err;
      console.log("Cuenta creada");
      res.render("profile", {
        username: data[0]["user"],
        id: data[0]["id"],
        ppimage: data[0]["pp"],
        edit: true,
      });
    });
  } else {
    var sql2 = `SELECT * FROM users WHERE id = '${[req.params.id]}'`;
    db.query(sql2, function (err, data, fields) {
      res.render("profile", {
        username: data[0]["user"],
        id: data[0]["id"],
        ppimage: data[0]["pp"],
        edit: false,
      });
    });
  }
});

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.session.loggedin) {
    res.render("index", {
      login: true,
      name: req.session.name,
      title: "suver",
      id: req.session.userid,
    });
  } else {
    res.render("index", {
      login: false,
      name: "Login",
      title: "suver",
      id: req.session.userid,
    });
  }
});

/* GET bestmoments page. */
router.get("/bestmoments", function (req, res, next) {
  if (req.session.loggedin) {
    res.render("crisviga", {
      login: true,
      name: req.session.name,
      title: "Best Moments",
      id: req.session.userid,
    });
  } else {
    res.render("crisviga", {
      login: false,
      name: "Login",
      title: "Best Moments",
      id: req.session.userid,
    });
  }
});

/* GET ooc page. */
router.get("/ooc", function (req, res, next) {
  if (req.session.loggedin) {
    res.render("ooc", {
      login: true,
      name: req.session.name,
      title: "Out Of Context",
      id: req.session.userid,
    });
  } else {
    res.render("ooc", {
      login: false,
      name: "Login",
      title: "Out Of Context",
      id: req.session.userid,
    });
  }
});

/* GET demonlist page. */
router.get("/demonlist", function (req, res, next) {
  if (req.session.loggedin) {
    res.render("Demonlist", {
      login: true,
      name: req.session.name,
      title: "SuverDemon List",
      id: req.session.userid,
    });
  } else {
    res.render("Demonlist", {
      login: false,
      name: "Login",
      title: "SuverDemon List",
      id: req.session.userid,
    });
  }
});

/* GET register page. */
router.get("/register", function (req, res, next) {
  if (req.session.loggedin) {
    res.render("register", {
      login: true,
      name: req.session.name,
      title: "Register",
      id: req.session.userid,
    });
  } else {
    res.render("register", {
      login: false,
      name: "Login",
      title: "Register",
      id: req.session.userid,
    });
  }
});

/* GET login page. */
router.get("/login", function (req, res, next) {
  if (req.session.loggedin) {
    res.render("login", {
      login: true,
      name: req.session.name,
      title: "Login",
      id: req.session.userid,
    });
  } else {
    res.render("login", {
      login: false,
      name: "Login",
      title: "Login",
      id: req.session.userid,
    });
  }
});

/* GET articles page. */
router.get("/articles/:blog_id", async function (req, res, next) {
  let blog_id = req.params.blog_id;

  let blog = await Blog.findOne({ _id:  blog_id, function(err, result) {
    if (err) { 
      return res.render("index", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "El blog no ha sido encontrado",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        login: false,
        name: req.session.name,
        ruta: "",
        title: "error",
        id: req.session.userid,
      });
     }}
  })
    
  let allcomments = await BlogComment.find({});

  let comments = []

  for(let comment of allcomments){
    if(blog.blog_comments.includes(comment._id)){
    comments.push(comment)
    }
  }

  console.log(blog);

  if (req.session.loggedin) {
    res.render("articles.ejs", {
      login: true,
      name: req.session.name,
      title: blog.title,
      id: blog_id,
      short_description: blog.short_description,
      description: blog.description,
      image: blog.image,
      comments: comments
    });
  } else {
    res.render("articles.ejs", {
      login: false,
      name: "Login",
      title: blog.title,
      id: blog_id,
      short_description: blog.short_description,
      description: blog.description,
      image: blog.image,
      comments: comments
    });
  
  }
  });

router.get("/articles/page2", function (req, res, next) {
  if (req.session.loggedin) {
    res.render("articles/page2.ejs", {
      login: true,
      name: req.session.name,
      title: "Login",
      id: req.session.userid,
    });
  } else {
    res.render("articles/page2.ejs", {
      login: false,
      name: "Login",
      title: "Login",
      id: req.session.userid,
    });
  }
});

router.get("/articles/page3", function (req, res, next) {
  if (req.session.loggedin) {
    res.render("articles/page3.ejs", {
      login: true,
      name: req.session.name,
      title: "Login",
      id: req.session.userid,
    });
  } else {
    res.render("articles/page3.ejs", {
      login: false,
      name: "Login",
      title: "Login",
      id: req.session.userid,
    });
  }
});

/* GET Edit page. */
router.get("/profiles/:id/edit", function (req, res, next) {
  var sql = `SELECT * FROM users WHERE user = '${[req.session.name]}'`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    req.params.id = data[0]["id"];
    res.render("edit", {
      username: data[0]["user"],
    });
  });
});

// Logout
router.get("/logout", function (req, res, next) {
  req.session.destroy((err) => {
    res.redirect(req.get("referer"));
  });
});

router.post("/articles/:blog_id/comments/create", async function (req, res, next) {
  let blog_id = req.params.blog_id;

  let blog = await Blog.findOne({ _id:  blog_id});
  let comments = await BlogComment.find({});

  if(!mongoose.Types.ObjectId.isValid(blog_id)){
		return res.status(400).send({
	  		message:'Invalid blog id',
	  		data:{}
	  	});
	}
  if(!req.session.loggedin){
    return res.render("articles", {
      alert: true,
      alertTitle: "Error",
      alertMessage: "Tienes que loggearte para comentar",
      alertIcon: "error",
      showConfirmButton: true,
      timer: false,
      login: false,
      name: "Login",
      title: blog.title,
      id: blog_id,
      short_description: blog.short_description,
      description: blog.description,
      image: blog.image,
      comments: comments
    });
  }

  Blog.findOne({ _id: blog_id })
    .then(async (blog) => {
      if (!blog) {
        return res.render("index", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "El blog no ha sido encontrado",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          login: false,
          name: req.session.name,
          title: "suver",
          id: req.session.userid,
        });
      } else {
        
        let newCommentDocument = new BlogComment({
          comment: req.body.comment,
          blog_id: blog_id,
          user_id: req.session.userid,
          username: req.session.name,
          pp: req.session.pp
        });

        var commentData = await newCommentDocument.save();

        await Blog.updateOne(
          { _id: blog_id },
          { $push: { blog_comments: commentData._id } }
        );
      }

      return res.render("articles", {
        alert: true,
        alertTitle: "Correcto",
        alertMessage: "Comentario enviado correctamente",
        alertIcon: "success",
        showConfirmButton: true,
        timer: false,
        login: false,
        name: req.session.name,
        title: blog.title,
        id: blog_id,
        ruta: "",
        short_description: blog.short_description,
        description: blog.description,
        image: blog.image,
        comments: comments
      });
    })
    .catch(err => {
      console.log(err)
      return res.status(400);
    });
});

module.exports = router;
