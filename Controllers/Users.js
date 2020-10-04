const Users = require('../Models/Users');
const Commands = require('../Models/Commands');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const now = new Date();
      const userToInsert = new Users({
        name: req.body.name,
        email: req.body.email,
        pseudo: req.body.pseudo,
        creationDate: now.toUTCString(),
        password: hash
      });
      userToInsert.save()
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
  Users.findOne({ $or: [{ email: req.body.identifiant }, { pseudo: req.body.identifiant }] })
    .then((user) => {
      if (!user) {
        res.status(404).json({ identifiant: false, password: false });
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({ identifiant: true, password: false });
            } else {
              res.status(200).json({
                idUser: user._id,
                token: jwt.sign({ idUser: user._id }, process.env.TOKEN, {
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
        Users.updateOne({ _id: req.params.idUser }, toSet)
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
    Users.updateOne({ _id: req.params.idUser }, toSet)
      .then(() => {
        res.status(200).json({ update: true });
      })
      .catch(error => {
        res.status(500).json({ error: true, errorMessage: error });
      });
  }
};

exports.getOneUser = (req, res) => {
  Users.findOne({ _id: req.params.idUser }, { password: 0 })
    .then(user => {
      res.status(200).json({ find: true, result: user });
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
  Users.deleteOne({ _id: req.params.idUser })
    .then(() => {
      res.status(200).json({ delete: true });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};