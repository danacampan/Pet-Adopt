import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import petRouter from './routes/petRoutes.js';
import seedRouter from './routes/seedRoutes.js';
import userRouter from './routes/userRoutes.js';
/* import nodemailer from 'nodemailer';

import seedRouter from './routes/seedRouter.js';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import orderRouter from './routes/orderRouter.js';
import uploadRouter from './routes/uploadRouter.js';
import seedPromotions from './promotionSeeder.js';
import promotionRouter from './routes/promotionRouter.js';
import cors from 'cors'; */

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

//seedPromotions();
const app = express();
app.use(express.json());
//app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api/seed', seedRouter);
app.use('/api/pets', petRouter);
app.use('/api/users', userRouter);

app.get('/api/pets/slug/:slug', (req, res) => {
  const pet = data.pets.find((x) => x.slug === req.params.slug);
  if (pet) {
    res.send(pet);
  } else {
    res.status(404).send({ message: 'Pet not found' });
  }
  res.send(data.pets);
});

app.get('/api/pets/:id', (req, res) => {
  const pet = data.pets.find((x) => x._id === req.params.id);
  if (pet) {
    res.send(pet);
  } else {
    res.status(404).send({ message: 'Pet not found' });
  }
  res.send(data.pets);
});

/* app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.post('/api/send-email', async (req, res) => {
  const { to = 'campan.dana15@gmail.com', subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'artimarket67@gmail.com',
      pass: 'oesa xvxz zvao nsch',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }
});

//app.use('/api/upload', uploadRouter);
//app.use('/api/seed', seedRouter);
app.use('/api/pets', petRouter);
app.use('/api/users', userRouter);
//app.use('/api/orders', orderRouter);
//app.use('/api/promotions', promotionRouter); */

app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
