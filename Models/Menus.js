const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const menuSchema = mongoose.Schema({
  idRestaurant: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  creationDate: { type: Date, required: true },
  lastUpdate: { type: Date },

  imageUrl: { type: String, unique: true },
  color: { type: String, required: true, default: "yellow" },

  like: { type: Number, required: true, default: 0 }, // Nombre de like
  dislike: { type: Number, required: true, default: 0 }, // Nombre de dislike

  usersLiked: { type: [String] }, // Tableau avec les id des users qui ont liker
  usersDisliked: { type: [String] } // Tableau avec les id des users qui ont disliker
});

menuSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Menus', menuSchema, 'Menus'); 