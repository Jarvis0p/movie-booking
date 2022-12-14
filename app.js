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
// mysql -h sql7.freemysqlhosting.net -u sql7530125 -p sql7530125


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
    mysqlQuery = "select sql7530125.show.SlotNo,sql7530125.show.Time,movie.MovieName,movie.Language,movie.Duration,movie.Img,movie.Description,theater.TheaterName from sql7530125.show, movie, theater where sql7530125.show.MovieNo = movie.MovieNo  and sql7530125.show.TheaterNo = theater.TheaterNo and movie.MovieNo =" + req.params.movieNo
    connections.query(mysqlQuery, function (err, result, fields) {
        if (err) throw err;
        result = JSON.parse(JSON.stringify(result));
        console.log(result);
        res.render("book-ticket", {
            data: result
        });
    });
});


// app.get("/book/:movie/:theater/:date/:time",function(req,res){
//     console.log(req.params.theater,req.params.date,req.params.time);
//     result = [
//         {   movie: req.params.movie,
//             theater: req.params.theater,
//             date: req.params.date,
//             time: req.params.time
//         }
//     ]
//     res.render("confirmation",{
//         data: result
//     });
// });

app.post("/book-ticket", function (req, res) {
    mysqlQuery = "select sql7530125.show.SlotNo,sql7530125.show.Time,movie.MovieName,movie.Language,movie.Duration,movie.Img,movie.Description,theater.TheaterName from sql7530125.show, movie, theater where sql7530125.show.MovieNo = movie.MovieNo  and sql7530125.show.TheaterNo = theater.TheaterNo and sql7530125.show.SlotNo =" + req.body.SlotNo
    connections.query(mysqlQuery, function (err, result, fields) {
        if (err) throw err;
        result = JSON.parse(JSON.stringify(result));
        console.log(result);
        res.render("confirmation", {
            data: result,
            date: req.body.date
        });
    });
});

app.post("/details", function (req, res) {
    console.log(req.body);
    insertQuery = "INSERT INTO `sql7530125`.`bookings` (`SlotNo`, `Name`, `Email`, `Date`) VALUES (\'" + req.body.SlotNo + "\', \'" + req.body.name + "\', \'" + req.body.name + "\', \'" + req.body.date + "\');"
    connections.query(insertQuery, function (err, insertResult, fields) {
        if (err) throw err;
        console.log("Into INSERT");
        console.log(insertResult.insertId);

        mysqlQuery = "SELECT * FROM sql7530125.bookings where BookingNo="+insertResult.insertId
        connections.query(mysqlQuery, function (err, result, fields) {
            if (err) throw err;
            result = JSON.parse(JSON.stringify(result));
            res.render("thanku", {
                data: result
            });
        });
    });
});




app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000");
});