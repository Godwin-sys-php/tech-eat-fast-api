const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require('helmet');
const fileUpload = require("express-fileupload");

const usersRoute = require('./Routes/Users');
const usersRestaurantRoute = require('./Routes/UsersRestaurant');
const restaurantRoute = require('./Routes/Restaurants');
const menusRoute = require('./Routes/Menus');
const dishesRoute = require('./Routes/Dishes');
const commandsRoute = require('./Routes/Commands');

const xss = require('xss');
const path = require('path');
const verifyToken = require('./Controllers/verifyToken');
const verifyTokenUser = require('./Controllers/verifyTokenUser');
const _ = require('underscore');

require('dotenv').config();

// Connexion à mongoDB

const app = express();

app.use(cors()); // On accepte toute les requêtes de n'importe quelle serveur

app.use(fileUpload({ createParentPath: true })); // File Upload

// BodyParser
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));

app.use(helmet());

app.use((req, res, next) => {
  if (Object.keys(req.body).length > 0) {
    for (let index in req.body) {
      if (_.isString(req.body[index])) {
        req.body[index] = req.body[index].trim();
        req.body[index] = xss(req.body[index]);
      }
    }
    next();
  } else {
    next();
  }
});

app.use(
  "/PDP_Resto",
  express.static(path.join(__dirname, "PDP_Resto"))
);
app.use(
  "/Images-Resto",
  express.static(path.join(__dirname, "Images-Resto"))
);
app.use(
  "/Images-Dishes",
  express.static(path.join(__dirname, "Images-Dishes"))
);
app.use(
  "/Invoices",
  express.static(path.join(__dirname, "Invoices"))
);

app.use('/users', usersRoute);
app.use('/users-restaurant', usersRestaurantRoute);
app.use('/restaurant', restaurantRoute);
app.use('/menus', menusRoute);
app.use('/dishes', dishesRoute);
app.post('/verifyToken/restaurant', verifyToken);
app.post('/verifyToken/user', verifyTokenUser);
app.use('/commands', commandsRoute);

module.exports = app;