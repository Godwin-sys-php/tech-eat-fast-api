const router = require('express').Router();

const userCtrl = require('../Controllers/Users');

router.post('/signup', limits, validatorUsers, userCtrl.signup); // Inscrit un utilisateur
router.post('/login'), limits, userCtrl.login; // Connecte un utilisateur
router.post('/login-no-jwt', limits, userCtrl.loginNoJwt); // Connecte un utilisateur sans jwt

router.put('/:idUser', limits, existUser, authUserMostSecure, validatorUsers, userCtrl.updateUser); // Modifie un utilisateur

router.get('/:idUser', limits, existUser, authUserForRestaurant, userCtrl.getOneUser); // Récupère un utilisateur uniquement par lui même ou le restaurant
router.get('/:idUser/command', limits, existUser, authUserMostSecure, userCtrl.getAllCommandOfUser); // Récupère toute les commandes d'un utilisateur

router.delete('/:idUser', limits, existUser, authUserMostSecure, userCtrl.deleteOneUser); // Supprime un utilisateur

module.exports = router;