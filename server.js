const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8080;

const app = express();

//set up for mongoDb on heroku
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/vidjagames";
mongoose.connect(MONGODB_URI);
mongoose.Promise = Promise;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({ defaultLayout: "main"}));

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, "/app/views/layouts/"),
  partialsDir: path.join(__dirname, "/app/views/partials/")
}));

app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, "/app/views"));
// app.set('partials', path.join(__dirname, "/app/views/partials"))

// Import routes and give the server access to them.
require("./app/routes/apiroutes")(app);
require("./app/routes/htmlroutes")(app);

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
