const express = require("express");
const path = require("path")
const mongoose = require("mongoose");
const ejs = require("ejs");

const Post = require("./models/post.js")

mongoose.connect("mongodb+srv://Admin:BlazeRazgriz@1632@cluster0.4cgyx.mongodb.net/blog?retryWrites=true&w=majority", {
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

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

app.post("/compose", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  await post.save();
  res.redirect("/");
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
