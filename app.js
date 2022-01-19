const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

// setting up the app using express
const app = express();

// using body-parser to take input from the user
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up the ejs on application
app.set('view engine', 'ejs');

// Setting up the public folder to set up the static files.
app.use(express.static("public"));



/********************Setting up mongoose dataserver, schema, model and collection */

// Connecting to mongo db server at local host 27017 with the database name wikiDB
mongoose.connect('mongodb://localhost:27017/wikidb', { useNewUrlParser: true });

// Creating a new schema for the documents;
const articleSchema = {
    title: String,
    content: String
};

// Creation of the mongoose model for the given article Schema 
// => collection name has to be article.
const Article = mongoose.model("Article", articleSchema);

/******************************************************************************** */




// managing different verbs targeting same route **********************************/
app.route("/articles")

    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            }
            else {
                res.send(err);
            }
        });
    })

    .post(function (req, res) {
        // saving the new article data into the database using the article schema
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        // We can even semd a call back function in save functions which will help
        // us know about any error occured.
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article!");
            }
            else {
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully deleted all articles!");
            }
            else {
                res.send(err);
            }
        });
    });




// *************requesting to get a specific article*******************
app.route("/articles/:articleTitle")

    .get(function (req, res) {

        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            }
            else {
                res.send("No articles maching those article is found");
            }
        });
    })

    // In order to prevent the overwrite the 4th line is added below.
    .put(function (req, res) {

        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            function (err) {
                if (!err) {
                    res.send("Successfully updated the data");
                }
            });
    })

    .patch(function (req, res) {

        Article.updateMany(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
                function(err) {
                    if (!err) {
                        res.send("Successfully updated article title to " + req.body.title);
                    }
                    else {
                        res.send(err);
                    }
                }
        );

    })

    .delete(function(req, res){

        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err)
                {
                    res.send("Successfully deleted the item which contained the title "+req.params.articleTitle);
                }
                else
                {
                    res.send(err);
                }
            }
        );
    });

/***********************************************************************************/



app.listen(process.env.PORT || 3000, function () {
    console.log("App is running at local host 3000");
});