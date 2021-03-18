require("dotenv").config()
const express = require("express");
const path = require("path")
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public/")));

app.use(session({
  secret: "I want to get a cat.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const Post = require("./models/post.js");
const User = require("./models/user.js");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4cgyx.mongodb.net/blog?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true 
});
  

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
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  req.logIn(user, (err) => {
    if(err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, async () => {
        res.redirect("/");
      });
    }
  })
})

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", (req, res) => {
   User.register({
     username: req.body.username, email: req.body.email}, req.body.password, (err, user) => {
     if(err) {
        console.log(err);
        res.redirect("/register")
     } else {
       passport.authenticate("local")(req, res, () => {
        res.redirect("/");
       });
     }
   })
})

app.get("/loggedIn", (req, res) => {
  if(req.isAuthenticated()) {
    res.render("loggedIn.ejs");
  } else {
    res.redirect("/login");
  }
})

app.get("/compose", (req, res) => {
  if(req.isAuthenticated()) {
    res.render("compose.ejs");
  } else {
    res.redirect("/login");
  }
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

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
})

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
