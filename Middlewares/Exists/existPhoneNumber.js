const Users = require("../../Models/Users");

module.exports = (req, res, next) => {
  Users.customQuery("SELECT * FROM usersPhoneNumber WHERE idUserPhoneNumber = ?", [req.params.idPhoneNumber])
    .then(user => {
      if (user.length > 0) {
        req.phoneNumber = user[0];
        next();
      } else {
        res.status(404).json({ phoneNumberNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};