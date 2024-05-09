import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { isAuth, isAdmin, formEmailTemplate } from '../utils.js';
import nodemailer from 'nodemailer';
import Form from '../models/formModel.js';

const formRouter = express.Router();

formRouter.get(
  '/',
  isAuth,

  expressAsyncHandler(async (req, res) => {
    const orders = await Form.find().populate('user', 'name');
    res.send(orders);
  })
);

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

// Ruta pentru a primi datele formularului și pentru a trimite email
formRouter.post('/', async (req, res) => {
  try {
    const newForm = new Form({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      pet: req.body.pet,
      address: req.body.address,
      city: req.body.city,
      county: req.body.county,
      zip: req.body.zip,
      country: req.body.country,
      ownPets: req.body.ownPets,
      homeOwnership: req.body.homeOwnership,
      yard: req.body.yard,
      landlordPolicy: req.body.landlordPolicy,
      abandon: req.body.abandon,
      children: req.body.children,
      aloneTime: req.body.aloneTime,
      leave: req.body.leave,
      problems: req.body.problems,
      crime: req.body.crime,
      agreement1: req.body.agreement1,
      agreement2: req.body.agreement2,
      agreement3: req.body.agreement3,
      agreement4: req.body.agreement4,
    });
    const savedForm = await newForm.save();

    const mailOptions = {
      from: 'campan.dana15@gmail.com',
      to: req.body.email,
      subject: 'Formular de cerere pentru adopție',
      html: `
      <body style="font-family: Arial, sans-serif;">

      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="text-align: center;">Confirmare cerere de adoptare</h2>
          
          <p>Bună ${req.body.firstName},</p>
          
          <p>Îți mulțumim că ai completat formularul nostru pentru adoptarea unui animal de companie. Mai jos găsești un rezumat al informațiilor furnizate:</p>
          
          <h3>Informații Personale:</h3>
          <p>
              <strong>Nume:</strong> ${req.body.firstName} ${req.body.lastName} <br>
              <strong>Email:</strong> ${req.body.email} <br>
              <strong>Număr de telefon:</strong> ${req.body.phone} <br>
              <strong>Numele animalului pe care doriți să-l adoptați:</strong> ${req.body.pet}
          </p>
          
          <h3>Adresă:</h3>
          <p>
              ${req.body.address}<br>
              ${req.body.city}, ${req.body.county}<br>
              <strong>Cod poștal:</strong> ${req.body.zip}<br>
              <strong>Țară:</strong> ${req.body.country}
          </p>
          
          <h3>Alte detalii:</h3>
          <p>
              <strong>Dețineți alte animale de companie?</strong> ${req.body.ownPets}<br>
              <strong>Locuiți în chirie sau dețineți casa?</strong> ${req.body.homeOwnership}<br>
              <strong>Aveți curte?</strong> ${req.body.yard}<br>
              <strong>Politica proprietarului referitoare la animalele de companie:</strong> ${req.body.landlordPolicy}<br>
              <strong>Ați abandonat vreodată un animal de companie?</strong> [Da/Nu]<br>
              <strong>Aveți copii în locuință?</strong> [Da/Nu] (Vârstele copiilor)<br>
              <strong>Câte ore pe zi va fi animalul lăsat singur?</strong> [Ore pe zi]<br>
              <strong>Unde va sta animalul dvs. de companie în cazul în care trebuie să plecați din oraș?</strong> [Locație]<br>
              <strong>Cum veți gestiona problemele comportamentale ale animalului dvs.?</strong> [Răspuns]<br>
              <strong>Ați fost vreodată condamnat pentru o infracțiune legată de animale?</strong> [Da/Nu]
          </p>
          
          <p>Vă mulțumim încă o dată pentru interesul dumneavoastră în adoptarea unui animal de companie. Vom analiza cererea dumneavoastră și vă vom contacta în cel mai scurt timp posibil.</p>
          
          <p>Cu stimă,<br>
          Echipa noastră de adopții</p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(201).send(savedForm);
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send({ message: 'Error submitting form' });
  }
});

/* const mailOptions = {
      from: 'petadopt38@gmail.com',
      to: req.body.email,
      subject: 'Formular de cerere pentru adopție',
      html: `
      <body style="font-family: Arial, sans-serif;">

      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="text-align: center;">Confirmare cerere de adoptare</h2>
          
          <p>Bună ${form.firstName},</p>
          
          <p>Îți mulțumim că ai completat formularul nostru pentru adoptarea unui animal de companie. Mai jos găsești un rezumat al informațiilor furnizate:</p>
          
          <h3>Informații Personale:</h3>
          <p>
              <strong>Nume:</strong> ${form.firstName} ${form.lastName} <br>
              <strong>Email:</strong> ${form.email} <br>
              <strong>Număr de telefon:</strong> ${form.phone} <br>
              <strong>Numele animalului pe care doriți să-l adoptați:</strong> ${form.pet}
          </p>
          
          <h3>Adresă:</h3>
          <p>
              ${form.address}<br>
              ${form.city}, ${form.county}<br>
              <strong>Cod poștal:</strong> ${form.zip}<br>
              <strong>Țară:</strong> ${form.country}
          </p>
          
          <h3>Alte detalii:</h3>
          <p>
              <strong>Dețineți alte animale de companie?</strong> ${form.ownPets}<br>
              <strong>Locuiți în chirie sau dețineți casa?</strong> ${form.homeOwnership}<br>
              <strong>Aveți curte?</strong> ${form.yard}<br>
              <strong>Politica proprietarului referitoare la animalele de companie:</strong> ${form.landlordPolicy}<br>
              <strong>Ați abandonat vreodată un animal de companie?</strong> [Da/Nu]<br>
              <strong>Aveți copii în locuință?</strong> [Da/Nu] (Vârstele copiilor)<br>
              <strong>Câte ore pe zi va fi animalul lăsat singur?</strong> [Ore pe zi]<br>
              <strong>Unde va sta animalul dvs. de companie în cazul în care trebuie să plecați din oraș?</strong> [Locație]<br>
              <strong>Cum veți gestiona problemele comportamentale ale animalului dvs.?</strong> [Răspuns]<br>
              <strong>Ați fost vreodată condamnat pentru o infracțiune legată de animale?</strong> [Da/Nu]
          </p>
          
          <p>Vă mulțumim încă o dată pentru interesul dumneavoastră în adoptarea unui animal de companie. Vom analiza cererea dumneavoastră și vă vom contacta în cel mai scurt timp posibil.</p>
          
          <p>Cu stimă,<br>
          Echipa noastră de adopții</p>
      </div>
      `, 
    }; */

export default formRouter;
