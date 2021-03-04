const User = require('../../Models/Users');

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
    
    if (req.method == 'PUT') {
      if (req.body.password) {
        if (schema.validate(req.body.password) && (req.body.name.length >= 2 && req.body.name.length < 30 && _.isString(req.body.name)) && (req.body.pseudo.length >= 2 && req.body.pseudo.length < 30 && _.isString(req.body.pseudo)) && validator.isEmail(req.body.email)) {
          User.customQuery('SELECT * FROM users WHERE (email= ? OR pseudo= ?) AND idUser != ?', [req.body.email, req.body.pseudo, req.params.idUser])
            .then(user => {
              if (user.length > 0) {
                user[0].email == req.body.email ? res.status(400).json({ existEmail: true }) : res.status(400).json({ existPseudo: true });
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
        if ((req.body.name.length >= 2 && req.body.name.length < 30 && _.isString(req.body.name)) && (req.body.pseudo.length >= 2 && req.body.pseudo.length < 30 && _.isString(req.body.pseudo)) && validator.isEmail(req.body.email)) {
          User.customQuery('SELECT * FROM users WHERE (email= ? OR pseudo= ?) AND idUser != ?', [req.body.email, req.body.pseudo, req.params.idUser])
            .then(user => {
              if (user.length > 0) {
                console.log(user);
                user[0].email == req.body.email ? res.status(400).json({ existEmail: true }) : res.status(400).json({ existPseudo: true });
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
        User.customQuery('SELECT * FROM users WHERE (email= ? OR pseudo= ?)', [req.body.email, req.body.pseudo])
          .then(user => {
            if (user.length > 0) {
              user[0].email == req.body.email ? res.status(400).json({ existEmail: true }) : res.status(400).json({ existPseudo: true });
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