import express from 'express';
import Pet from '../models/petModel.js';
import data from '../data.js';
import User from '../models/userModel.js';
import Shelter from '../models/shelterModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Pet.deleteMany({});
  const createdProducts = await Pet.insertMany(data.pets);
  await User.deleteMany({});
  const createdUsers = await User.insertMany(data.users);
  await Shelter.deleteMany({});
  const createdShelters = await Shelter.insertMany(data.shelters);
  res.send({ createdProducts, createdUsers, createdShelters });
});
export default seedRouter;
