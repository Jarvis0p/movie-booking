const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
const mysql = require('mysql');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// mysql connection
let options = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'movie_booking'
};

var connections = mysql.createConnection(options);

connections.connect(function (err) {
    if (err) throw err;
});


app.use(session({
    key: "keyin",
    secret: "My Little Secret",
    resave: false,
    saveUninitialized: true
}))

app.get("/", function (req, res) {
    mysqlQuery = "SELECT * FROM movie"
    connections.query(mysqlQuery, function (err, result, fields) {
        if (err) throw err;
        result = JSON.parse(JSON.stringify(result));
        res.render("home",{
            data: result
        });
    });
});

app.get("/movies", function (req, res) {
    mysqlQuery = "SELECT * FROM movie"
    connections.query(mysqlQuery, function (err, result, fields) {
        if (err) throw err;
        result = JSON.parse(JSON.stringify(result));
        res.render("movies",{
            data: result
        });
    });
});

app.get("/book-ticket/:movieNo", function (req, res) {
    mysqlQuery = "SELECT * FROM movie where MovieNo="+req.params.movieNo
    connections.query(mysqlQuery, function (err, result, fields) {
        if (err) throw err;
        result = JSON.parse(JSON.stringify(result));
        res.render("book-ticket",{
            data: result
        });
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000");
});