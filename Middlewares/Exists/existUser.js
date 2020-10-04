const Users = require("../../Models/Users");

module.exports = (req, res, next) => {
  Users.findOne({ _id: req.params.idUser })
    .then(user => {
      if (user) {
        next();
      } else {
        res.status(404).json({ userNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};