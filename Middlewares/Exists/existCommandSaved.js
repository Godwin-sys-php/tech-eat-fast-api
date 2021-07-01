const Commands = require('../../Models/Commands');

module.exports = (req, res, next) => {
  Commands.customQuery("SELECT * FROM commandsSaved WHERE idCommandSaved = ?", [rq.params.idCommandSaved])
    .then(command => {
      if (command) {
        next();
      } else {
        res.status(404).json({ commandNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
    });
}