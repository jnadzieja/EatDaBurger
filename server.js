// Requirements for express to run properly
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Requirements for handlebars to run properly
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Requirements for mysql to run properly
const mysql = require("mysql");
let connection;
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "burgers_db"
  });
}
connection.connect(function(err) {
  if (err) {
    console.log("Error contecting to server: ", err.stack);
  }
  console.log("Connected with id " + connection.threadId);
});

// Primary app
app.get("/", function(req, res) {
  connection.query("SELECT * FROM burgers", function(err, data) {
    if (err) throw err;
    res.render("index", { burgers: data });
  });
});

app.post("/add-burger", function(req, res) {
  connection.query("INSERT INTO burgers (burger_name) VALUES (?)", [req.body.burger_name], function(err, data) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(PORT, function() {
  console.log("Server listening on http://localhost:", PORT)
});