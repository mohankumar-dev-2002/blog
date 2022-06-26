//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var _ = require('lodash');

const homeStartingContent = "hey there! this is mohan here ,this is project to wrote your daily journal";
const aboutContent = "you can compose the new journal by adding it!";
const contactContent = "for more updates sign up ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://mohan:Mohankumar@todolistcluster.qpdx5lf.mongodb.net/?retryWrites=true&w=majority', ({
  useNewUrlParser: true
}));

const blogSchema = {
  title: String,
  content: String
}

const Blog = mongoose.model(
  "Blog", blogSchema
);





app.get('/', (req, res) => {
  Blog.find({}, (err, results) => {
    res.render('home', {
      homeContent: homeStartingContent,
      contentOutput: results

    });
  });
});

app.get('/about', (req, res) => {
  res.render("about", {
    aboutPage: aboutContent,

  });
});


app.get('/contact', (req, res) => {
  res.render("contact", {
    contactPage: contactContent
  });
});

app.get('/compose', (req, res) => {
  res.render("compose");
});


app.post('/compose', (req, res) => {

  const titleInput = req.body.titleInput;
  const contentInput = req.body.contentInput;
  const dbContent = new Blog({
    title: titleInput,
    content: contentInput
  });


  Blog.insertMany(dbContent, (err) => {
    if (err) {
      console.log("unSuccessful");
    } else {
      console.log("Successful");
    }

  });

  res.redirect("/");
})

app.get('/posts/:postId', (req, res) => {

  Blog.find({}, (err, result) => {

    result.forEach((i) => {
      let checkTitle = i._id;
      checkTitle = _.lowerCase(checkTitle);
      passedValue =_.lowerCase(req.params.postId);
      if (checkTitle == _.lowerCase(req.params.postId)) {
        console.log("match found");
        res.render('post', {
          postHeading: i.title,
          postContent: i.content
        });
      } else {
        console.log("no match found");

      }
    });
  });


});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
