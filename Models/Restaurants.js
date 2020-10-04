const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const restaurantSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  website: { type: String },
  address: { type: String, required: true, unique: true },
  logoUrl: { type: String, required: true },

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
});

restaurantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Restaurants', restaurantSchema, 'Restaurants'); 