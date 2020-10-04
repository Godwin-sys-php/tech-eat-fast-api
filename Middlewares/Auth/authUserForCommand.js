const Commands = require("../../Models/Commands");
const Users = require("../../Models/Users");
const Resto = require('../../Models/Restaurants');
const moment = require('moment');
const parseTime = require('../../Helpers/parseHoursOurMinute');

require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    
    if (req.method == 'PUT') {
      const idCommand = req.params.idCommand;
      Commands.findOne({ _id: idCommand })
        .then(command => {
          if (command && command.canRetry == true) {
            if (command.idUser == decodedToken.idUser) {
              Users.findOne({ _id: command.idUser })
                .then(user => {
                  user ? next() : res.status(400).json({ invalidToken: true });
                })
                .catch(error => {
                  res.status(500).json({ error: true, errorMessage: error });
                });
            } else {
              res.status(400).json({ invalidToken: true });
            }
          } else {
            res.status(400).json({ cannotRetry: true });
          }
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    } else {
      req.body.idRestaurant == req.params.idRestaurant ? () => { } : res.status(400).json({ invalidIdRestaurant: true, message: "idRestaurant in params no equal to idRestaurant in body" });

      Resto.findOne({ _id: req.params.idRestaurant })
        .then(resto => {
          let found = false;
          let capture= false;

          const now = moment();
          const daysOfTheWeek = now.day();
          const hours = parseTime(now.hour());
          const minute = parseTime(now.minute());
          const correct= `${hours}:${minute}`

          for (let index in resto.daysDelivery) {
            if (resto.daysDelivery[index].day == daysOfTheWeek) {
              found = true;
              capture = {open: resto.daysDelivery[index].begin, close: resto.daysDelivery[index].end};
            }
          }

          if (!capture && !found) {
            res.status(400).json({ restoDeliveryItsClose: true });
          } else {
            if (!(correct >= capture.open && correct <= capture.close)) {
              res.status(400).json({ restoDeliveryItsClose: true });
            }  
          }
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
      
      if (decodedToken.idUser == req.body.idUser) { 
        Users.findOne({ id: decodedToken.idUser })
          .then(user => {
            user ? next() : res.status(400).json({ invalidToken: true });
          })
          .catch(error => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      } else {
        res.status(400).json({ invalidToken: true });
      }
    }
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
};