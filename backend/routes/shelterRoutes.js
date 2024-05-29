import express from 'express';
import Shelter from '../models/shelterModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import mongoose from 'mongoose';
import Pet from '../models/petModel.js';

const { ObjectId } = mongoose.Types;
const shelterRouter = express.Router();

shelterRouter.get('/', async (req, res) => {
  try {
    const shelters = await Shelter.find();
    res.json(shelters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
shelterRouter.get('/name/:name', async (req, res) => {
  try {
    const shelter = await Shelter.findOne({ name: req.params.name }).populate(
      'user'
    );
    if (shelter) {
      res.send(shelter);
    } else {
      res.status(404).send({ message: 'Shelter not found' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

shelterRouter.post('/:shelterId/pets', async (req, res) => {
  try {
    const { shelterId } = req.params;
    const { name, age, breed, description, photos } = req.body;
    const pet = new Pet({
      name,
      age,
      breed,
      description,
      photos,
      shelter: shelterId,
    });
    const createdPet = await pet.save();

    const shelter = await Shelter.findById(shelterId);
    shelter.pets.push(createdPet);
    await shelter.save();

    res.status(201).send({ message: 'Pet Added', pet: createdPet });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

shelterRouter.get('/shelter/:shelterId', async (req, res) => {
  const shelterId = req.params.shelterId;

  if (!ObjectId.isValid(shelterId)) {
    return res.status(400).send({ message: 'Invalid User ID' });
  }

  try {
    const shelter = await Shelter.findById(shelterId).populate('pets');
    res.send(shelter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

shelterRouter.put('/:id', getShelter, async (req, res) => {
  if (req.body.name != null) {
    res.shelter.name = req.body.name;
  }

  try {
    const updatedShelter = await res.shelter.save();
    res.json(updatedShelter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

shelterRouter.get('/:id', async (req, res) => {
  const shelterId = req.params.id;
  if (!ObjectId.isValid(shelterId)) {
    return res.status(400).send({ message: 'Invalid Shelter ID' });
  }

  try {
    // Populate the user field
    const shelter = await Shelter.findById(shelterId).populate('user');
    if (shelter) {
      res.status(200).send(shelter);
    } else {
      res.status(404).send({ message: 'Shelter not found' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'petadopt38@gmail.com',
    pass: 'xqvy mudu zcok moie',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

shelterRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const existingUser = await Shelter.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email-ul e deja inregistrat' });
    }

    try {
      const newUser = new Shelter({
        name: req.body.name,
        address: req.body.address,
        phone_number: req.body.phone_number,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        description: req.body.description,
        user: req.body.user,
      });

      const savedUser = await newUser.save();

      const confirmationToken = jwt.sign(
        { userId: savedUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      savedUser.confirmationToken = confirmationToken;
      await savedUser.save();

      const confirmationLink = `${process.env.FRONTEND_URL}/confirm/${confirmationToken}`;

      const mailOptions = {
        from: 'petadopt38@gmail.com',
        to: savedUser.email,
        subject: 'Confirmă înregistrarea',
        text: `Dă click pe următorul link pentru a-ți verifica emailul: ${confirmationLink}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({
            message: 'Eroare la trimiterea email-ului de confirmare.',
          });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(201).json({
            message: 'Utilizator înregistrat cu succes.',
          });
        }
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Eroare la înregistrarea utilizatorului.' });
    }
  })
);

shelterRouter.get('/:id/posts', async (req, res) => {
  const shelterId = req.params.id;
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

shelterRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const shelter = await Shelter.findOne({ email: req.body.email });
    if (shelter && bcrypt.compareSync(req.body.password, shelter.password)) {
      res.status(200).send({
        _id: shelter._id,
        name: shelter.name,
        email: shelter.email,
        token: generateToken(shelter),
      });
    } else {
      res.status(401).send({ message: 'Email sau parola invalide' });
    }
  })
);

export default shelterRouter;
