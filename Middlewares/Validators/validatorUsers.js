const User = require("../../Models/Users");

const _ = require("underscore");

module.exports = (req, res, next) => {
  try {
    if (req.method == "PUT") {
      if (
        req.body.name.length >= 2 &&
        req.body.name.length < 30 &&
        _.isString(req.body.name)
      ) {
        User.customQuery(
          "SELECT * FROM users WHERE phoneNumber=? AND idUser != ?",
          [req.body.phoneNumber, req.params.idUser]
        )
          .then((user) => {
            if (user.length > 0) {
              return res.status(400).json({ existPhoneNumber: true, })
            } else {
              next();
            }
          })
          .catch((error) => {
            res.status(500).json({ error: true });
          });
      } else {
        res.status(400).json({ invalidForm: true });
      }
    } else {
      if (
        req.body.name.length >= 2 &&
        req.body.name.length < 30 &&
        _.isString(req.body.name)
      ) {
        User.customQuery(
          "SELECT * FROM users WHERE phoneNumber=?",
          [req.body.phoneNumber]
        )
          .then((user) => {
            if (user.length > 0) {
              return res.status(400).json({ existPhoneNumber: true, })
            } else {
              next();
            }
          })
          .catch((error) => {
            res.status(500).json({ error: true });
          });
      } else {
        res.status(400).json({ invalidForm: true });
      }
    }
  } catch (error) {
    res.status(500).json({ error: true });
  }
};
