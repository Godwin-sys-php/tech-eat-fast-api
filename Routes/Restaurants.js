const router = require("express").Router();

router.post('/:idRestaurant/users-restaurant'); // Ajoute un utilisateur à un restaurant
router.post('/:idRestaurant/commands'); // Ajoute une commande à un restaurant
router.post('/:idRestaurant/menus'); // Ajoute un menu à un restaurant
router.post('/:idRestaurant/menus/:idMenu/dish'); // Ajoute un plats au menu d'un restaurant

router.put('/:idRestaurant/users-restaurant/:idUserRestaurant'); // Modifie un utilisateur d'un restaurant

router.put('/:idRestaurant/commands/:idCommand'); // Modifie une commande d'un restaurant si le client est autorisé à le faire
router.put('/:idRestaurant/commands/:idCommand/accept'); // Accepte une commande
router.put('/:idRestaurant/commands/:idCommand/refuse'); // Refuser une commande avec un motif et dit si oui ou non l'utilisateur peut la modifier

router.put('/:idRestaurant/menus/:idMenu'); // Modifie le menu d'un restaurant
router.put('/:idRestaurant/dish/:idDish'); // Modifie le plats d'un restaurant

router.delete('/:idRestaurant/users-restaurant/:idUserRestaurant'); // Supprime un utilisateur d'un restaurant
router.delete('/:idRestaurant/menus/:idMenu'); // Supprime le menu d'un restaurant
router.delete('/:idRestaurant/dish/:idDish'); // Supprime le plats d'un restaurant

// Public: 
router.get('/'); // Récupère tout les restaurants
router.get('/most-popular'); // Récupère les restaurants les plus populaire
router.get('/:idRestaurant'); // Récupère un restaurant
router.get('/:idRestaurant/menus'); // Récupère les menus d'un restaurant avec ses plats

// Private:
router.get('/:idRestaurant/users-restaurant'); // Récupère tout les utilisateurs d'un restaurant
router.get('/:idRestaurant/users-restaurant/:idUserRestaurant'); // Récupère un utilisateur d'un restaurant
router.get('/:idRestaurant/commands'); // Récupère toute les commandes d'un restaurant
router.get('/:idRestaurant/commands/:idCommand'); // Récupère une commande d'un restaurant

module.exports = router;  
