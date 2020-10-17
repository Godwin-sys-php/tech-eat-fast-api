const router = require('express').Router();

const limits = require('../Middlewares/Limits/limits');

const existRestaurant = require('../Middlewares/Exists/existRestaurant');
const existCommand = require('../Middlewares/Exists/existCommand');
const authUser = require('../Middlewares/Auth/authUser');
const authRestaurant = require('../Middlewares/Auth/authRestaurant');
const authUserForUpdateOrDelete = require('../Middlewares/Auth/authUserForUpdateOrDelete');

const commandCtrl = require('../Controllers/Commands');

router.post('/restaurant/:idRestaurant', limits(50, 15), existRestaurant, authUser, commandCtrl.addCommand);

router.put('/:idCommand/accept', limits(200, 15), existCommand, authRestaurant, commandCtrl.acceptCommand);
router.put('/:idCommand/refuse', limits(200, 15), existCommand, authRestaurant, commandCtrl.refuseCommand);
router.put('/:idCommand', limits(200, 15), existCommand, authUser, authUserForUpdateOrDelete, commandCtrl.updateCommand);
router.put('/:idCommand/setReady', limits(200, 15), existCommand, authRestaurant, commandCtrl.setReady);
router.put('/:idCommand/setFinished', limits(200, 15), existCommand, authRestaurant, commandCtrl.setFinished);

router.get('/restaurant/:idRestaurant/not-finish', limits(200, 15), existRestaurant, authRestaurant, commandCtrl.getNotFinishedCommand);
router.get('/restaurant/:idRestaurant', limits(200, 15), existRestaurant, authRestaurant, commandCtrl.getCommandOfRestaurant);

router.delete('/:idCommand', limits(200, 15), existCommand, authUserForUpdateOrDelete, commandCtrl.deleteOneCommand);

module.exports = router;