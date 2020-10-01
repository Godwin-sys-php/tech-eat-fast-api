const router = require("express").Router();

const menuCtrl = require('../Controllers/Menus');

router.get('/', limits, menuCtrl.getAllMenus) // Récupère tout les menus
router.get('/:idMenu', limits, existMenus, menuCtrl.getOneMenu); // Récupère un menu avec ses plats
router.get('/most-popular', limits, menuCtrl.getMostPopularMenus); // Récupère les menus les plus populaire

module.exports = router;