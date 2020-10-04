const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const dishSchema = mongoose.Schema({
  idRestaurant: { type: String, required: true },
  idMenu: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  creationDate: { type: Date, required: true },

  imageUrl: { type: String, required: true },

  ingredients: { type: [String] },

  available: { type: Boolean, required: true, default: true }
});

dishSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Dishes', dishSchema, 'Dishes'); 