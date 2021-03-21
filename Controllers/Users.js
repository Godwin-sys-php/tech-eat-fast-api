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
        email: req.body.email.toLowerCase(),
        pseudo: req.body.pseudo.toLowerCase(),
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
  Users.customQuery('SELECT * FROM users WHERE email=? OR pseudo=?', [req.body.identifiant.toLowerCase(), req.body.identifiant.toLowerCase()])
    .then((user) => {
      if (user.length < 1) {
        res.status(404).json({ identifiant: false, password: false });
      } else {
        bcrypt.compare(req.body.password, user[0].password)
          .then(async (valid) => {
            if (!valid) {
              res.status(401).json({ identifiant: true, password: false });
            } else {
              const users = await Users.findOne({ idUser: user[0].idUser });
              const phoneNumbers = await Users.customQuery("SELECT * FROM usersPhoneNumber WHERE idUser = ?", [ user[0].idUser]);
              const address = await Users.customQuery("SELECT * FROM usersAddress WHERE idUser = ?", [user[0].idUser]);
              res.status(200).json({
                user: {...users, phoneNumbers: phoneNumbers, address: address, password: null,},
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

exports.addAddress = (req, res) => {
  const toInsert = {
    idUser: req.params.idUser,
    address: req.body.address
  };

  Users.customQuery("INSERT INTO usersAddress SET ?", [toInsert])
    .then(() => {
      Users.customQuery("SELECT * FROM usersAddress WHERE idUser = ?", [req.params.idUser])
        .then((address) => {
          res.status(201).json({ create: true, address: address })
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.addPhoneNumber = (req, res) => {
  const toInsert = {
    idUser: req.params.idUser,
    phoneNumber: (req.body.phoneNumber),
  };

  Users.customQuery("INSERT INTO usersPhoneNumber SET ?", [toInsert])
    .then(() => {
      Users.customQuery("SELECT * FROM usersPhoneNumber WHERE idUser = ?", [req.params.idUser])
        .then((phoneNumbers) => {
          res.status(201).json({ create: true, phoneNumbers: phoneNumbers })
        })
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
          pseudo: req.body.pseudo,
          password: hash,
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

exports.updateAddress = (req, res) => {
  const toSet = {
    address: req.body.address,
  };

  Users.customQuery("UPDATE usersAddress SET ? WHERE idUserAdress = ?", [toSet, req.params.idAddress])
    .then(() => {
      Users.customQuery("SELECT * FROM usersAddress WHERE idUser = ?", [req.params.idUser])
        .then((address) => {
          res.status(201).json({ update: true, address: address })
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.updatePhoneNumber = (req, res) => {
  const toSet = {
    phoneNumber: req.body.phoneNumber,
  };

  Users.customQuery("UPDATE usersPhoneNumber SET ? WHERE idUserPhoneNumber = ?", [toSet, req.params.idPhoneNumber])
  .then(() => {
    Users.customQuery("SELECT * FROM usersPhoneNumber WHERE idUser = ?", [req.params.idUser])
      .then((phoneNumbers) => {
        res.status(201).json({ update: true, phoneNumbers: phoneNumbers })
      })
      .catch(error => {
        res.status(500).json({ error: true, errorMessage: error });
      });
  })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getOneUser = async (req, res) => {
  try {
    const users = await Users.findOne({ idUser: req.params.idUser });
    const phoneNumbers = await Users.customQuery("SELECT * FROM usersPhoneNumber WHERE idUser = ?", [req.params.idUser]);
    const address = await Users.customQuery("SELECT * FROM usersAddress WHERE idUser = ?", [req.params.idUser]);
    
    res.status(200).json({ find: true, result:{...users, phoneNumbers: phoneNumbers, address: address, password: null,} });
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
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

exports.getAllAddress = (req, res) => {
  Users.customQuery("SELECT * FROM usersAddress WHERE idUser = ?", [req.params.idUser])
    .then((address) => {
      res.status(200).json({ find: true, result: address, });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getOneAddress = (req, res) => {
  Users.customQuery("SELECT * FROM usersAddress WHERE idUserAdress = ?", [req.params.idAddress])
    .then((address) => {
      res.status(200).json({ find: true, result: address, });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getAllPhoneNumber = (req, res) => {
  Users.customQuery("SELECT * FROM usersPhoneNumber WHERE idUser = ?", [req.params.idUser])
    .then((phoneNumber) => {
      res.status(200).json({ find: true, result: phoneNumber, });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getOnePhoneNumber = (req, res) => {
  Users.customQuery("SELECT * FROM usersPhoneNumber WHERE idUserPhoneNumber = ?", [req.params.idPhoneNumber])
    .then((phoneNumber) => {
      res.status(200).json({ find: true, result: phoneNumber, });
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

exports.deleteOneAddress = (req, res) => {
  Users.customQuery("DELETE FROM usersAddress WHERE idUserAdress = ?", [req.params.idAddress])
    .then(() => {
      Users.customQuery("SELECT * FROM usersAddress WHERE idUser = ?", [req.params.idUser])
        .then((address) => {
          res.status(201).json({ delete: true, address: address })
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.deleteOnePhoneNumber = (req, res) => {
  Users.customQuery("DELETE FROM usersPhoneNumber WHERE idUserPhoneNumber = ?", [req.params.idPhoneNumber])
    .then(() => {
      Users.customQuery("SELECT * FROM usersPhoneNumber WHERE idUser = ?", [req.params.idUser])
        .then((phoneNumbers) => {
          res.status(201).json({ delete: true, phoneNumbers: phoneNumbers })
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};