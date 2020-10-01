const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const restaurantsRoute = require('./Routes/Restaurants');
const menusRoute = require('./Routes/Menus');
const dishRoute = require('./Routes/Dishes');

const app = express();

app.use(cors()); // On accepte toute les requêtes de n'importe quelle serveur

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/restaurants', restaurantsRoute);
app.use('/menus', menusRoute);
app.use('/dish', dishRoute);
// app.use('/users', usersRoute);

module.exports = app;
