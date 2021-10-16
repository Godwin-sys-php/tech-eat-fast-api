const Users = require("../../Models/Users");

module.exports = (req, res, next) => {
  console.log("kqhkjhkjhfjkqds");
  Users.findOne({ idUser: req.params.idUser })
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ userNotFound: true });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: true,  });
    });
};