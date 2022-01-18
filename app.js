const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

// setting up the app using express
const app = express();

// using body-parser to take input from the user
app.use(bodyParser.urlencoded({extended: true}));

// Setting up the ejs on application
app.set('view engine', 'ejs');

// Setting up the public folder to set up the static files.
app.use(express.static("public"));








/********************Setting up mongoose dataserver, schema, model and collection */

// Connecting to mongo db server at local host 27017 with the database name wikiDB
mongoose.connect('mongodb://localhost:27017/wikidb', {useNewUrlParser : true});

// Creating a new schema for the documents;
const articleSchema = {
    title : String,
    content: String
};

// Creation of the mongoose model for the given article Schema 
// => collection name has to be article.
const Article = mongoose.model("Article", articleSchema);

/******************************************************************************** */










app.get("/", function(req, res)
{
    res.sendFile(__dirname+"indes.html");
});


app.post("/", function(req, res)
{
    console.log(req.body.name);
});


app.listen(process.env.POST || 3000, function()
{
    console.log("App is running at local host 3000");
});