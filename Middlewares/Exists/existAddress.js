const Users = require("../../Models/Users");

module.exports = (req, res, next) => {
  console.log("fhjkdhfjkss");
  Users.customQuery("SELECT * FROM usersAddress WHERE idUserAdress = ?", [req.params.idAddress])
    .then(user => {
      if (user.length > 0) {
        req.address = user[0];
        next();
      } else {
        res.status(404).json({ addressNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
    });
};