require("dotenv").config()
const express = require("express");
const path = require("path")
const mongoose = require("mongoose");
const ejs = require("ejs");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const Post = require("./models/post.js");
const User = require("./models/user.js");

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4cgyx.mongodb.net/blog?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true 
});

const app = express();


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public/")));
  

app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    res.render("home.ejs", {
      posts: posts
    });
  })
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({username: username}, (err, found) => {
    if(err) {
      console.log(err)
    } else {
      if(found) {
        bcrypt.compare(password, found.password, (err, result) => {
          if(result) {
            res.send("logged in.")
          } else {
            res.send("Username or password is incorrect");
          }
        });
      } else {
        res.send("Username or password is incorrect");
      }
    }
  })
})

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if(!err){
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash
      })
      user.save((err) => {
        if(err) {
          console.log(err);
        } else {
          res.redirect("/")
        }
      });
    }
  });
})

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save((err) => {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", (req, res) => { 
  Post.findOne({_id: req.params.postId}, (err, post) => {
    res.render("post.ejs", {post: post});
  })
});

app.get("*", (req, res) => {
  res.send("404 Page not found")
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server successfully started");
});
