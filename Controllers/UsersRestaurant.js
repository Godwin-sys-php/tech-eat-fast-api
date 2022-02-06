const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsersRestaurant = require('../Models/UsersRestaurant');
const moment = require('moment');

require('dotenv').config();

exports.login = (req, res) => {
  UsersRestaurant.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        console.log(1);
        res.status(404).json({ email: false, password: false });
      } else {
        console.log(2);
        bcrypt.compare(req.body.password, user.password)
          .then(async (valid) => {
            if (!valid) {
              res.status(401).json({ email: true, password: false });
            } else {
              if (req.body.notificationToken) {
                const tokens = await UsersRestaurant.customQuery("SELECT * FROM pushTokens WHERE idRestaurant = ?", [user.idRestaurant]);
                let exist = false;
                for (let index in tokens) {
                  if (tokens[index].token === req.body.notificationToken) {
                    exist = true;
                    break;
                  }
                }
                if (!exist) {
                  await UsersRestaurant.customQuery("INSERT INTO pushTokens SET idRestaurant = ?, idUser=?, token=?", [user.idRestaurant, user.idUserRestaurant, req.body.notificationToken]);
                }
              }
              return res.status(200).json({
                idUser: user.idUserRestaurant,
                user: user,
                idRestaurant: user.idRestaurant,
                token: jwt.sign({ idUserRestaurant: user.idUserRestaurant, idRestaurant: user.idRestaurant }, process.env.TOKEN, {
                  expiresIn: "7d",
                })
              });
            }
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ error: true, });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
    });
};

exports.addOneUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const now = moment();
      const toInsert = {
        idRestaurant: req.params.idRestaurant,
        name: req.body.name,
        email: req.body.email,
        creationDate: now.unix(),
        level: req.body.level,
        pdpUrl: `${req.protocol}://${req.get('host')}/PDP_Resto/default.jpg`,
        password: hash
      };
      UsersRestaurant.insertOne(toInsert)
        .then(res.status(201).json({ create: true }))
        .catch(error => {
          res.status(500).json({ error: true,  });
        });
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
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
        UsersRestaurant.updateOne(toSet, { idUserRestaurant: req.params.idUserResto })
          .then(() => {
            res.status(200).json({ update: true });
          })
          .catch(error => {
            res.status(500).json({ error: true,  });
          });
      })
      .catch(error => {
        res.status(500).json({ error: true,  });
      });
  } else {
    toSet = {
      name: req.body.name,
      email: req.body.email,
      level: req.body.level,
    };
    UsersRestaurant.updateOne(toSet, { idUserRestaurant: req.params.idUserResto })
      .then(() => {
        res.status(200).json({ update: true });
      })
      .catch(error => {
        res.status(500).json({ error: true,  });
      });
  }
};

exports.getOneUser = (req, res) => {
  UsersRestaurant.findOne({ idUserRestaurant: req.params.idUserResto })
    .then(user => {
      res.status(200).json({ find: true, result: {...user, password: null} });
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
    });
};

exports.getAllUser = (req, res) => {
  UsersRestaurant.customQuery('SELECT * FROM usersRestaurant WHERE idRestaurant=?' ,[req.params.idRestaurant])
    .then(users => {
      res.status(200).json({ find: true, result: users });
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
    });
};

exports.deleteOneUser = (req, res) => {
  UsersRestaurant.findOne({ idUserRestaurant: req.params.idUserResto })
    .then(user => {
      if (user.level >= 3) {
        res.status(403).json({ cannotDeleteAdmin: true });
      } else {
        UsersRestaurant.delete({ idUserRestaurant: req.params.idUserResto })
          .then(() => {
            res.status(200).json({ delete: true });
          })
          .catch(error => {
            res.status(500).json({ error: true,  });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
    });
};