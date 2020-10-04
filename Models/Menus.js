const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const menuSchema = mongoose.Schema({
  idRestaurant: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  creationDate: { type: Date, required: true },
  imageUrl: { type: String, unique: true },
});

menuSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Menus', menuSchema, 'Menus'); 