var express = require("express");
var router = express.Router();
var bcryptjs = require("bcryptjs");
const connection = require("../database/db.js");
const db = require("../database/db");
const db2 = require("../database/mongo.js");
const bodyparser = require("body-parser");
const multer = require("multer");
const Blog = require("../models/blogs");
const Post = require("../models/post");
const mongoose = require("mongoose");
const BlogComment = require("../models/blogComment");
const Message = require("../models/messages");

// const cookieSession = require('cookie-session');
// const cookieParser = require('cookie-parser');
// router.use(cookieParser());

// router.use(cookieSession({
//   name: 'session',
//   secret: process.env.SESSION_SECRET,
//   maxAge: 24 * 60 * 60 * 1000, // 1 day
//   sameSite: 'strict',
//   secure: process.env.NODE_ENV === 'production', // only set 'secure' to true in production
// }));

const session = require("express-session");

const MongoStore = require("connect-mongo");

const user = process.env.USERMONGO;
const password = process.env.PASSWORDMONGO;
const datab = process.env.DBMONGO;
const mongoUrl = `mongodb+srv://${user}:${password}@cluster0.zioea.mongodb.net/${datab}?retryWrites=true&w=majority`;

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: mongoUrl,
      collection: "sessions",
    }),
  })
);

router.post("/register", async (req, res, next) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordush = await bcryptjs.hash(pass, 8);
  var defaultpp = "https://suver-page.vercel.app/images/default-pp.jpg";
  connection.query(
    `INSERT INTO users ("user", "pass", "pp") VALUES ($1, $2, $3)`,
    [user, passwordush, defaultpp],
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
  if (user && pass) {
    const query = {
      text: 'SELECT * FROM users WHERE "user" = $1',
      values: [user],
    };
    try {
      const { rows } = await db.query(query);
      if (rows.length == 0 || !(await bcryptjs.compare(pass, rows[0].pass))) {
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
        console.log(rows);
        req.session.loggedin = true;
        req.session.name = rows[0].user;
        req.session.userid = rows[0].id;
        req.session.pp = rows[0].pp;

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
    } catch (e) {
      console.error("Error:", e);
      res.render("login", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "There was a problem with the database",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "login",
        login: false,
        name: "Login",
      });
    }
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

const { ImgurClient } = require("imgur");
const client = new ImgurClient({ clientId: process.env.IMGUR_ID });

const storage = multer.memoryStorage();
const upload = multer({
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
router.post("/loading", upload.single("image"), async (req, res) => {
  if (!req.file) {
    console.log("No file upload");
  } else {
    try {
      const img = req.file.buffer.toString("base64");
      const response = await client.upload({
        image: img,
        type: "base64",
      });
      const imgsrc = response.data.link;
      const query = {
        text: "UPDATE users SET pp = $1 WHERE ID = $2",
        values: [imgsrc, req.session.userid],
      };
      await db.query(query);

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
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
});

router.get("/profiles/:userid", async (req, res, next) => {
  if (req.params.userid == "profile") {
    const query = {
      text: "SELECT * FROM users WHERE ID = $1",
      values: [req.session.userid],
    };
    try {
      const { rows } = await db.query(query);
      if (rows.length > 0) {
        const posts = await Post.find({ user_id: req.session.userid });
        console.log(posts);
        res.render("profile", {
          username: rows[0]["user"],
          id: rows[0]["id"],
          ppimage: rows[0]["pp"],
          edit: true,
          posts: posts,
        });
      } else {
        res.status(404).send("User not found");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  } else {
    const query = {
      text: "SELECT * FROM users WHERE ID = $1",
      values: [req.params.userid],
    };
    try {
      const { rows } = await db.query(query);
      if (rows.length > 0) {
        const posts = await Post.find({ user_id: req.params.userid });
        res.render("profile", {
          username: rows[0]["user"],
          id: rows[0]["id"],
          ppimage: rows[0]["pp"],
          edit: false,
          posts: posts,
        });
      } else {
        res.status(404).send("User not found");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
});

/* GET home page. */
router.get("/", function (req, res, next) {
  if (!req.body) {
    // If there's no request body, send an error response
    return res.status(400).send("Request body is missing");
  }
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

router.get("/bestmoments", async function (req, res, next) {
  

  const messages = await Message.find({});

  const messageArray = messages.map((message) => message.toObject());

  res.render("bestmoments", {
    login: req.session.loggedin ? true : false,
    name: req.session.loggedin ? req.session.name : "Login",
    title: "Best Moments",
    moments: messageArray,
    id: req.session.userid,
  });
});

/* GET ooc page. */
router.get("/ooc", function (req, res, next) {
  res.render("ooc", {
    login: req.session.loggedin ? true : false,
    name: req.session.loggedin ? req.session.name : "Login",
    title: "Out Of Context",
    id: req.session.userid,
  });
});

/* GET demonlist page. */
router.get("/demonlist", function (req, res, next) {
  res.render("demonlist", {
    login: req.session.loggedin ? true : false,
    name: req.session.loggedin ? req.session.name : "Login",
    title: "SuverDemon List",
    id: req.session.userid,
  });
});

/* GET register page. */
router.get("/register", function (req, res, next) {
  res.render("register", {
    login: req.session.loggedin ? true : false,
    name: req.session.loggedin ? req.session.name : "Login",
    title: "Register",
    id: req.session.userid,
  });
});

/* GET login page. */
router.get("/login", function (req, res, next) {
  if (req.session.loggedin) {
    res.render("ErrorHandler", {
      title: "Login",
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
  let blog = await Blog.findOne({
    _id: blog_id,
    function(err, result) {
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
      }
    },
  });

  let allcomments = await BlogComment.find({});

  let comments = [];

  for (let comment of allcomments) {
    if (blog.blog_comments.includes(comment._id)) {
      comments.push(comment);
    }
  }

  if (req.session.loggedin) {
    res.render("articles.ejs", {
      login: true,
      name: req.session.name,
      title: blog.title,
      id: blog_id,
      short_description: blog.short_description,
      description: blog.description,
      image: blog.image,
      comments: comments,
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
      comments: comments,
    });
  }
});

/* GET Edit page. */
router.get("/profiles/:userid/edit", async (req, res, next) => {
  try {
    if (req.session.loggedin && req.params.userid == req.session.userid) {
      const query = {
        text: 'SELECT * FROM users WHERE "user" = $1',
        values: [req.session.name],
      };
      const { rows } = await db.query(query);
      req.params.id = rows[0]["ID"];
      res.render("edit", {
        username: rows[0]["user"],
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//logout
router.get("/logout", function (req, res) {
  req.session.destroy(function(){
    res.redirect('/');
  });
});

router.post(
  "/articles/:blog_id/comments/create",
  async function (req, res, next) {
    let blog_id = req.params.blog_id;

    let blog = await Blog.findOne({ _id: blog_id });
    let comments = await BlogComment.find({});

    if (!mongoose.Types.ObjectId.isValid(blog_id)) {
      return res.status(400).send({
        message: "Invalid blog id",
        data: {},
      });
    }
    if (!req.session.loggedin) {
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
        comments: comments,
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
            pp: req.session.pp,
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
          comments: comments,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400);
      });
  }
);

router.post("/posts/create", async (req, res) => {
  const { postText } = req.body;

  const query = {
    text: "SELECT * FROM users WHERE ID = $1",
    values: [req.session.userid],
  };
  try {
    const { rows } = await db.query(query);
    console.log(rows[0]);
    const post = new Post({
      postText: postText,
      user_id: req.session.userid,
      username: rows[0].user,
      pp: rows[0].pp,
    });

    await post.save();
    return res.render("profile", {
      alert: true,
      alertTitle: "Correcto",
      alertMessage: "Publicación enviado correctamente",
      alertIcon: "success",
      showConfirmButton: true,
      ruta: "profiles/profile",
      timer: false,
      login: false,
      username: req.session.name,
      id: req.session.userid,
      ppimage: req.session.pp,
      edit: true,
      posts: [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
