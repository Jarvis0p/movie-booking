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
    host: 'sql7.freemysqlhosting.net',
    port: '3306',
    user: 'sql7530125',
    password: '4jqW1PkCiG',
    database: 'sql7530125'
};

var connections = mysql.createConnection(options);

connections.connect(function (err) {
    if (err) throw err;
    console.log("connected");
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
        res.render("home", {
            data: result
        });
    });
});

app.get("/movies", function (req, res) {
    mysqlQuery = "SELECT * FROM movie"
    connections.query(mysqlQuery, function (err, result, fields) {
        if (err) throw err;
        result = JSON.parse(JSON.stringify(result));
        res.render("movies", {
            data: result
        });
    });
});

app.get("/book-ticket/:movieNo", function (req, res) {
    mysqlQuery = "select movie_booking.show.Time,movie.MovieName,movie.Language,movie.Duration,movie.Img,movie.Description,theater.TheaterName from movie_booking.show, movie, theater where movie_booking.show.MovieNo = movie.MovieNo  and movie_booking.show.TheaterNo = theater.TheaterNo and movie.MovieNo ="+req.params.movieNo
    connections.query(mysqlQuery, function (err, result, fields) {
        if (err) throw err;
        result = JSON.parse(JSON.stringify(result));
        console.log(result);
        res.render("book-ticket", {
            data: result
        });
    });
});

app.post("/book-ticket", function (req, res) {
    console.log(req.body);
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000");
});