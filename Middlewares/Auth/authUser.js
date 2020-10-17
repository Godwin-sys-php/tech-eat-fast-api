const Users = require("../../Models/Users");

require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];// Récupère le token 
    const idUser = req.body.idUser;// Récupère le userID

    const decodedToken = jwt.verify(token, process.env.TOKEN);// Décode le JWT

    if (idUser && idUser !== decodedToken.idUser) { // Si il y a un userId et il est différent de celui qui est dans le JWT
      res.status(403).json({ invalidToken: true });
    } else { // Sinon: 
      Users.findOne({ _id: decodedToken.idUser }) // On vérifie si le userId existe bien en base de donnée
        .then(user => {
          if (!user) {// Si il n'existe pas
            res.status(403).json({ invalidToken: true });
          } else {
            req.idUser = decodedToken.idUser;
            next();// On passe au prochain middleware
          }
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    }
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
};