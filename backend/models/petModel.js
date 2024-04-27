const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  breed: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, enum: ['Masculin', 'Feminin', 'Necunoscut'] },
  address: { type: String, required: true },
  description: { type: String, required: true },
  medical_info: { type: String, required: true },
  adoption_status: { type: String, default: 'Disponibil' },
  photos: [String] /*{ type: String, required: true },*/,
});

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
