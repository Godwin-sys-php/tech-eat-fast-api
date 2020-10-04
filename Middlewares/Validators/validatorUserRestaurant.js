const UserResto = require('../../Models/UsersRestaurant');

const validator = require("validator");
const passwordValidator = require("password-validator");
const _ = require('underscore');

module.exports = (req, res, next) => {
  try {

    const schema = new passwordValidator();// On crée une nouvelle instance de l'objet
    schema// On crée un nouveau schéma
      .is().min(8)                                    // Minimum length 8
      .has().uppercase()                              // Must have uppercase letters
      .has().lowercase()                              // Must have lowercase letters
      .has().digits(2)                                // Must have at least 2 digits
    
    let condition = (schema.validate(req.body.password)) && (req.body.name.length >= 2 && req.body.name.length < 30 && _.isString(req.body.name)) && validator.isEmail(req.body.email) && (req.body.level >= 1 && req.body.level < 4);

    let condition2= (req.body.name.length >= 2 && req.body.name.length < 30 && _.isString(req.body.name)) && validator.isEmail(req.body.email) && (req.body.level >= 1 && req.body.level < 4);

    req.params.idRestaurant == req.body.idRestaurant ? () => { } : res.status(400).json({ invalidIdRestaurant: true, message: "idRestaurant in params no equal to idRestaurant in body" });

    if (req.method == 'PUT') {
      if (req.body.password) {
        if (condition) {
          UserResto.findOne({ email: req.body.email, _id: { $ne: req.params.idUserRestaurant } })
            .then(user => {
              !user ? next() : res.status(400).json({ existEmail: true });
            })
            .catch(error => {
              res.status(500).json({ error: true, errorMessage: error });
            });
        } else {
          res.status(400).json({ invalidForm: true });
        }
      } else {
        if (condition2) {
          UserResto.findOne({ email: req.body.email, _id: { $ne: req.params.idUserRestaurant } })
            .then(user => {
              !user ? next() : res.status(400).json({ existEmail: true });
            })
            .catch(error => {
              res.status(500).json({ error: true, errorMessage: error });
            });
        } else {
          res.status(400).json({ invalidForm: true });
        }
      }
    } else {
  
      if (condition) {
        UserResto.findOne({ email: req.body.email })
          .then(user => {
            !user ? next() : res.status(400).json({ existEmail: true });
          })
          .catch(error => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      } else {
        res.status(400).json({ invalidForm: true });
      }
    }
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
};