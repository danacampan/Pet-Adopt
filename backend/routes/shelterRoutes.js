import express from 'express';
import Shelter from '../models/shelterModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';

const shelterRouter = express.Router();

// GET pentru a obtine toate adaposturile de animale
shelterRouter.get('/', async (req, res) => {
  try {
    const shelters = await Shelter.find();
    res.json(shelters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
shelterRouter.get('/name/:name', async (req, res) => {
  const shelter = await Shelter.findOne({ name: req.params.name });
  if (shelter) {
    res.send(shelter);
  } else {
    res.status(404).send({ message: 'Shelter not found' });
  }
});

// GET pentru a obtine un adapost specific dupa ID
shelterRouter.get('/:id', getShelter, (req, res) => {
  res.json(res.shelter);
});

// POST pentru a crea un nou adapost de animale
shelterRouter.post('/', async (req, res) => {
  const shelter = new Shelter({
    name: req.body.name,
    address: req.body.address,
    phone_number: req.body.phone_number,
    email: req.body.email,
    description: req.body.description,
    photos: req.body.photos,
  });

  try {
    const newShelter = await shelter.save();
    res.status(201).json(newShelter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT pentru a actualiza un adăpost de animale existent
shelterRouter.put('/:id', getShelter, async (req, res) => {
  if (req.body.name != null) {
    res.shelter.name = req.body.name;
  }
  // Actualizează alte campuri ale adăpostului aici...

  try {
    const updatedShelter = await res.shelter.save();
    res.json(updatedShelter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE pentru a sterge un adapost de animale existent
shelterRouter.delete('/:id', getShelter, async (req, res) => {
  try {
    await res.shelter.remove();
    res.json({ message: 'Adăpostul a fost șters' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

shelterRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const shelterId = req.params.id;
    const shelter = await Shelter.findById(shelterId);
    if (shelter) {
      if (shelter.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: parseInt(req.body.rating),
        comment: req.body.comment,
      };
      shelter.reviews.push(review);
      shelter.numReviews = shelter.reviews.length;
      shelter.rating =
        shelter.reviews.reduce((total, review) => {
          const rating = parseFloat(review.rating);
          if (!isNaN(rating)) {
            return total + rating;
          } else {
            return total;
          }
        }, 0) / shelter.reviews.length;
      const updatedShelter = await shelter.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedShelter.reviews[updatedShelter.reviews.length - 1],
        numReviews: updatedShelter.numReviews,
        rating: Number(updatedShelter.rating),
      });
    } else {
      res.status(404).send({ message: 'Shelter Not Found' });
    }
  })
);

// Functie middleware pentru a obtine un adapost de animale dupa ID
async function getShelter(req, res, next) {
  try {
    shelter = await Shelter.findById(req.params.id);
    if (shelter == null) {
      return res.status(404).json({ message: 'Adăpostul nu a fost găsit' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.shelter = shelter;
  next();
}

export default shelterRouter;
