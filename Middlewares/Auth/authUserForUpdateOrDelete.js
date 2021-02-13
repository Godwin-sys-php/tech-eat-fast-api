const Commands = require("../../Models/Commands");

module.exports = (req, res, next) => {
  Commands.findOne({ idCommand: req.params.idCommand })
    .then(command => {
      if (req.method == 'PUT') {
        command.canRetry ? next() : res.status(400).json({ cantRetry: true });
      } else {
        command.accept !== 'true' ? next() : res.status(400).json({ cantDelete: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};