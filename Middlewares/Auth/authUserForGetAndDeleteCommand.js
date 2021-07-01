require('dotenv').config();

const jwt = require('jsonwebtoken');
const Users = require('../../Models/Users');
const Commands = require('../../Models/Commands');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.TOKEN);

    Users.findOne({ idUser: decodedToken.idUser })
      .then(user => {
        if (user) {
          Commands.findOne({ idCommand: req.params.idCommand })
            .then(command => {
              if (command.idUser == user.idUser) {
                next();
              } else {
                res.status(400).json({ invalidToken: true });
              }
            })
            .catch(error => {
              res.status(500).json({ error: true,  });
            });
        } else {
          res.status(400).json({ invalidToken: true });
        }
      })
      .catch(error => {
        res.status(500).json({ error: true,  });
      });
  } catch (error) {
    res.status(500).json({ error: true,  });
  }
};