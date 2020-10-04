const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require('helmet');

const mongoose = require('mongoose');

const usersRoute = require('./Routes/Users');

require('dotenv').config();

// Connexion à mongoDB
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASE_STRING_CONNECTION)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(cors()); // On accepte toute les requêtes de n'importe quelle serveur

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use('/users', usersRoute);

module.exports = app;
