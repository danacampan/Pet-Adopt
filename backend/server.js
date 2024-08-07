import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import petRouter from './routes/petRoutes.js';
import seedRouter from './routes/seedRoutes.js';
import userRouter from './routes/userRoutes.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import shelterRouter from './routes/shelterRoutes.js';
import formRouter from './routes/formRoutes.js';
import chatBotRouter from './routes/chatBotRoutes.js';
import nodemailer from 'nodemailer';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
//app.use(express.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);
app.use('/api/pets', petRouter);
app.use('/api/users', userRouter);
app.use('/api/shelters', shelterRouter);
app.use('/api/forms', formRouter);
app.use('/api/chatbot', chatBotRouter);

app.post('/api/send-email', async (req, res) => {
  const { to = 'campan.dana15@gmail.com', subject, text } = req.body;

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
