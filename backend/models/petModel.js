import mongoose from 'mongoose';
import userSchema from './userModel.js';

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    breed: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, enum: ['Masculin', 'Feminin', 'Necunoscut'] },
    address: { type: String, required: true },
    description: { type: String, required: true },
    medical_info: { type: String, required: false },
    adoption_status: {
      type: String,
      enum: ['Disponibil', 'Indisponibil'],
      default: 'Disponibil',
    },
    photos: [String] /*{ type: String, required: true },*/,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shelter',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Pet = mongoose.model('Pet', petSchema);
export default Pet;
