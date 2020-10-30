const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsersRestaurant = require('../Models/UsersRestaurant');

require('dotenv').config();

exports.login = (req, res) => {
  UsersRestaurant.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(404).json({ email: false, password: false });
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({ email: true, password: false });
            } else {
              res.status(200).json({
                idUser: user._id,
                idRestaurant: user.idRestaurant,
                token: jwt.sign({ idUserRestaurant: user._id, idRestaurant: user.idRestaurant }, process.env.TOKEN, {
                  expiresIn: "2d",
                })
              });
            }
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ error: true, errorMessage: error });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.addOneUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const now = new Date();
      const userToInsert = new UsersRestaurant({
        idRestaurant: req.params.idRestaurant,
        name: req.body.name,
        email: req.body.email,
        creationDate: now.toUTCString(),
        level: req.body.level,
        pdpUrl: `${req.protocol}://${req.get('host')}/PDP_Resto/default.jpg`,
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

exports.updateOneUser = (req, res) => {
  let toSet;
  if (req.body.password) {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        toSet = {
          name: req.body.name,
          email: req.body.email,
          password: hash,
          level: req.body.level,
        };
        UsersRestaurant.updateOne({ _id: req.params.idUserResto }, toSet)
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
      level: req.body.level,
    };
    UsersRestaurant.updateOne({ _id: req.params.idUserResto }, toSet)
      .then(() => {
        res.status(200).json({ update: true });
      })
      .catch(error => {
        res.status(500).json({ error: true, errorMessage: error });
      });
  }
};

exports.getOneUser = (req, res) => {
  UsersRestaurant.findOne({ _id: req.params.idUserResto }, { password: 0 })
    .then(user => {
      res.status(200).json({ find: true, result: user });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getAllUser = (req, res) => {
  UsersRestaurant.find({ idRestaurant: req.params.idRestaurant }, { password: 0 })
    .then(user => {
      res.status(200).json({ find: true, result: user });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.deleteOneUser = (req, res) => {
  UsersRestaurant.findOne({ _id: req.params.idUserResto })
    .then(user => {
      if (user.level >= 3) {
        res.status(403).json({ cannotDeleteAdmin: true });
      } else {
        UsersRestaurant.deleteOne({ _id: req.params.idUserResto })
          .then(() => {
            res.status(200).json({ delete: true });
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