const Users = require('../Models/Users');
const Commands = require('../Models/Commands');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

require('dotenv').config();

exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const now = moment();
      const toInsert = {
        name: req.body.name,
        email: req.body.email,
        pseudo: req.body.pseudo,
        creationDate: now.unix(),
        password: hash
      };
      Users.insertOne(toInsert)
        .then(res.status(201).json({ create: true }))
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.login = (req, res) => {
  Users.customQuery('SELECT * FROM users WHERE email=? OR pseudo=?', [req.body.identifiant, req.body.identifiant])
    .then((user) => {
      if (user.length < 1) {
        res.status(404).json({ identifiant: false, password: false });
      } else {
        bcrypt.compare(req.body.password, user[0].password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({ identifiant: true, password: false });
            } else {
              res.status(200).json({
                idUser: user[0].idUser,
                token: jwt.sign({ idUser: user[0].idUser }, process.env.TOKEN, {
                  expiresIn: "168h",
                })
              });
            }
          })
          .catch(error => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.loginNoJwt = (req, res) => {
  Users.customQuery('SELECT * FROM users WHERE email=? OR pseudo=?', [req.body.identifiant, req.body.identifiant])
    .then((user) => {
      if (user.length < 1) {
        res.status(404).json({ identifiant: false, password: false });
      } else {
        bcrypt.compare(req.body.password, user[0].password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({ identifiant: true, password: false });
            } else {
              res.status(200).json({
                idUser: user[0].idUser,
              });
            }
          })
          .catch(error => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.updateOneUser = (req, res) => {
  let toSet;
  if (req.body.password) {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        toSet = {
          name: req.body.name,
          email: req.body.email,
          pseudo: req.body.pseudo,
          password: hash,
          address: req.body.address,
          phoneNumber: req.body.phoneNumber
        };
        Users.updateOne(toSet, { idUser: req.params.idUser })
          .then(() => {
            res.status(200).json({ update: true });
          })
          .catch(error => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      })
      .catch(error => {
        res.status(500).json({ error: true, errorMessage: error });
      });
  } else {
    toSet = {
      name: req.body.name,
      email: req.body.email,
      pseudo: req.body.pseudo,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber
    };
    Users.updateOne(toSet, { idUser: req.params.idUser })
      .then(() => {
        res.status(200).json({ update: true });
      })
      .catch(error => {
        res.status(500).json({ error: true, errorMessage: error });
      });
  }
};

exports.getOneUser = (req, res) => {
  Users.findOne({ idUser: req.params.idUser })
    .then(user => {
      res.status(200).json({ find: true, result: {...user, password: null} });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getAllCommand = (req, res) => {
  Commands.findOne({ idUser: req.params.idUser })
    .then(commands => {
      res.status(200).json({ find: true, result: commands });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.deleteOneUser = (req, res) => {
  Users.delete({ idUser: req.params.idUser })
    .then(() => {
      res.status(200).json({ delete: true });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};