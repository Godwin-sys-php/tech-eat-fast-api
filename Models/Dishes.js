const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const dishSchema = mongoose.Schema({
  idRestaurant: { type: String, required: true },
  idMenu: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  creationDate: { type: Date, required: true },
  lastUpdate: { type: Date },

  imageUrl: { type: String, required: true },

  ingredients: { type: [String] },

  like: { type: Number, required: true, default: 0 }, // Nombre de like
  dislike: { type: Number, required: true, default: 0 }, // Nombre de dislike

  usersLiked: { type: [String] }, // Tableau avec les id des users qui ont liker
  usersDisliked: { type: [String] }, // Tableau avec les id des users qui ont disliker

  available: { type: Boolean, required: true, default: true }
});

dishSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Dishes', dishSchema, 'Dishes'); 