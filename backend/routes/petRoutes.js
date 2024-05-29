import express from 'express';
const petRouter = express.Router();
import Pet from '../models/petModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

// Route pentru a obtine toate animalele
petRouter.get('/', async (req, res) => {
  try {
    const pets = await Pet.find().populate('user');
    res.send(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
petRouter.get('/user', isAuth, async (req, res) => {
  try {
    const pets = await Pet.find({ user: req.user._id });
    res.send(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

petRouter.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log('Received userId:', userId);
  if (!ObjectId.isValid(userId)) {
    return res.status(400).send({ message: 'Invalid User ID' });
  }
  try {
    const pets = await Pet.find({ user: new ObjectId(userId) });
    res.send(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

petRouter.get('/shelter/:shelterId', async (req, res) => {
  const shelterId = req.params.shelterId;

  if (!ObjectId.isValid(shelterId)) {
    return res.status(400).send({ message: 'Invalid Shelter ID' });
  }
  try {
    const pets = await Pet.find({ shelter: new ObjectId(shelterId) });
    res.send(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

petRouter.get('/slug/:slug', async (req, res) => {
  const pet = await Pet.findOne({ slug: req.params.slug }).populate('user');
  if (pet) {
    res.send(pet);
  } else {
    res.status(404).send({ message: 'Pet not found' });
  }
});

petRouter.get('/:id', async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (pet) {
    res.send(pet);
  } else {
    res.status(404).send({ message: 'Pet not found' });
  }
});

// Route pentru a crea un animal nou
petRouter.post('/addpost', async (req, res) => {
  const pet = new Pet({
    name: req.body.name,
    slug: req.body.slug,
    breed: req.body.breed,
    age: req.body.age,
    gender: req.body.gender,
    address: req.body.address,
    description: req.body.description,
    medical_info: req.body.medical_info,
    adoption_status: req.body.adoption_status,
    photos: req.body.photos,
    user: req.body.user,
  });

  try {
    const newPet = await pet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

petRouter.put('/:id', isAuth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (pet) {
      if (pet.user.toString() === req.user._id.toString()) {
        if (
          req.body.adoption_status === 'Disponibil' ||
          req.body.adoption_status === 'Indisponibil'
        ) {
          pet.adoption_status = req.body.adoption_status;
          const updatedPet = await pet.save();
          res.send(updatedPet);
        } else {
          res
            .status(400)
            .send({ message: 'Valoarea statusului de adoptie nu este valida' });
        }
      } else {
        res.status(403).send({
          message: 'Nu aveti permisiunea de a actualiza acest animal',
        });
      }
    } else {
      res.status(404).send({ message: 'Animalul nu a fost găsit' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

petRouter.delete(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const pet = await Pet.findById(req.params.id);
      if (!pet) {
        return res.status(404).send({ message: 'Pet Not Found' });
      }

      if (pet.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .send({ message: 'You are not authorized to delete this pet' });
      }

      await Pet.findByIdAndDelete(req.params.id);
      res.send({ message: 'Pet Deleted' });
    } catch (error) {
      res.status(500).send({ message: 'Server Error' });
    }
  })
);

export default petRouter;
