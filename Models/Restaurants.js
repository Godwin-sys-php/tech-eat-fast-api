const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const restaurantSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  website: { type: String },
  address: { type: String, required: true, unique: true },
  logoUrl: { type: String, required: true },
  description: { type: String, required: true },

  creationDate: { type: Date, required: true },
  
  paymentMethodAccept: { type: [String], required: true }, // Possiblilité: CB, m-pesa, airtel-money, orange-money
  acceptCash: { type: Boolean, default: true }
});

restaurantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Restaurants', restaurantSchema, 'Restaurants'); 