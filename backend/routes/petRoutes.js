import express from 'express';
const petRouter = express.Router();
import Pet from '../models/petModel.js';

// Route pentru a obtine toate animalele
petRouter.get('/', async (req, res) => {
  try {
    const pets = await Pet.find();
    res.send(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

petRouter.get('/slug/:slug', async (req, res) => {
  const pet = await Pet.findOne({ slug: req.params.slug });
  if (pet) {
    res.send(pet);
  } else {
    res.status(404).send({ message: 'Pet not found' });
  }
});

petRouter.get('/:id', async (req, res) => {
  const pet = await PetById.find(req.params.id);
  if (pet) {
    res.send(pet);
  } else {
    res.status(404).send({ message: 'Pet not found' });
  }
});

// Route pentru a crea un animal nou
/* petRouter.post('/', async (req, res) => {
  const pet = new Pet({
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
    gender: req.body.gender,
    address: req.body.address,
    description: req.body.description,
    medical_info: req.body.medical_info,
    adoption_status: req.body.adoption_status,
    photos: req.body.photos,
  });

  try {
    const newPet = await pet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pentru a obtine un animal dupa ID
petRouter.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pentru a actualiza un animal dupa ID
petRouter.patch('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(pet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pentru a sterge un animal dupa ID
petRouter.delete('/:id', async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Animal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
*/
export default petRouter;
