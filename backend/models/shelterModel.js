import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const shelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, lowercase: true, required: true },
    password: { type: String, required: true },
    description: { type: String, required: true },
    photos: { type: [String], required: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Shelter = mongoose.model('Shelter', shelterSchema);
export default Shelter;
