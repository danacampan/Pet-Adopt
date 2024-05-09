import mongoose from 'mongoose';

const formSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    //pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    pet: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    county: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    ownPets: { type: String, required: true },
    homeOwnership: { type: String, required: true },
    yard: { type: String, required: true },
    landlordPolicy: { type: String, required: true },
    abandon: { type: String, required: true },
    children: { type: String, required: true },
    aloneTime: { type: String, required: true },
    leave: { type: String, required: true },
    problems: { type: String, required: true },
    crime: { type: String, required: true },
    agreement1: { type: String, required: true },
    agreement2: { type: String, required: true },
    agreement3: { type: String, required: true },
    agreement4: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Form = mongoose.model('Form', formSchema);
export default Form;
