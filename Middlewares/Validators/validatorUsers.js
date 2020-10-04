const User = require('../../Models/Users');

const validator = require("validator");
const passwordValidator = require("password-validator");
const _ = require('underscore');
const verifyArrayPhoneNumbers = require('../../Helpers/verifyArrayPhoneNumbers');

module.exports = (req, res, next) => {
  try {
    const schema = new passwordValidator();// On crée une nouvelle instance de l'objet
    schema// On crée un nouveau schéma
      .is().min(8)                                    // Minimum length 8
      .has().uppercase()                              // Must have uppercase letters
      .has().lowercase()                              // Must have lowercase letters
      .has().digits(2)                                // Must have at least 2 digits
    
    if (req.method == 'PUT') {
      if (req.body.password) {
        if (schema.validate(req.body.password) && (req.body.name.length >= 2 && req.body.name.length < 30 && _.isString(req.body.name)) && (req.body.pseudo.length >= 2 && req.body.pseudo.length < 30 && _.isString(req.body.pseudo)) && validator.isEmail(req.body.email) && (_.isArray(req.body.address) && _.isArray(req.body.phoneNumber) && verifyArrayPhoneNumbers(req.body.phoneNumber))) {
          User.findOne({ $or: [{ email: req.body.email }, { pseudo: req.body.pseudo }], _id: { $ne: req.params.idUser } })
            .then(user => {
              if (user) {
                user.email == req.body.email ? res.status(400).json({ existEmail: true }) : res.status(400).json({ existPseudo: true });
              } else {
                next();
              }
            })
            .catch(error => {
              res.status(500).json({ error: true, errorMessage: error });
            });
        } else {
          res.status(400).json({ invalidForm: true });
        }
      } else {
        if ((req.body.name.length >= 2 && req.body.name.length < 30 && _.isString(req.body.name)) && (req.body.pseudo.length >= 2 && req.body.pseudo.length < 30 && _.isString(req.body.pseudo)) && validator.isEmail(req.body.email) && (_.isArray(req.body.address) && _.isArray(req.body.phoneNumber) && verifyArrayPhoneNumbers(req.body.phoneNumber))) {
          User.findOne({ $or: [{ email: req.body.email }, { pseudo: req.body.pseudo }], _id: { $ne: req.params.idUser } })
            .then(user => {
              if (user) {
                user.email == req.body.email ? res.status(400).json({ existEmail: true }) : res.status(400).json({ existPseudo: true });
              } else {
                next();
              }
            })
            .catch(error => {
              res.status(500).json({ error: true, errorMessage: error });
            });
        } else {
          res.status(400).json({ invalidForm: true });
        }
      }
    } else {
      if (schema.validate(req.body.password) && (req.body.name.length >= 2 && req.body.name.length < 30 && _.isString(req.body.name)) && (req.body.pseudo.length >= 2 && req.body.pseudo.length < 30 && _.isString(req.body.pseudo)) && validator.isEmail(req.body.email)) {
        User.findOne({ $or: [{ email: req.body.email }, { pseudo: req.body.pseudo }] })
          .then(user => {
            if (user) {
              user.email == req.body.email ? res.status(400).json({ existEmail: true }) : res.status(400).json({ existPseudo: true });
            } else {
              next();
            }
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
}