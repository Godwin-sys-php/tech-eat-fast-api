const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const restaurantSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  website: { type: String, unique: true },
  address: { type: String, required: true, unique: true },
  logoUrl: { type: String, required: true, unique: true },
  color: { type: String, required: true, default: "green" },

  like: { type: Number, required: true, default: 0 }, // Nombre de like
  dislike: { type: Number, required: true, default: 0 }, // Nombre de dislike

  usersLiked: { type: [String] }, // Tableau avec les id des users qui ont liker
  usersDisliked: { type: [String] }, // Tableau avec les id des users qui ont disliker

  creationDate: { type: Date, required: true },
  
  days: { type: [Object], required: true },
  /*
    Structure: 
    [
      { day: "L'effectif du jour", begin: "Heure d'ouverture", end: "Heure de fermeture" }
    ]
  */
  
 daysDelivery: { type: [Object], required: true },
 /*
   Structure: 
   [
     { day: "L'effectif du jour", begin: "Heure d'ouverture", end: "Heure de fermeture" }
   ]
 */
  
  paymentMethodAccept: { type: [String], required: true }, // Possiblilité: CB, m-pesa, airtel-money, orange-money, direct-cash

  status: { type: String, required: true, default: "dispo" },

  valid: { type: Boolean, required: true, default: true }
});

restaurantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Restaurants', restaurantSchema, 'Restaurants'); 