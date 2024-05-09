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

    const mailOptionsToPetOwner = {
      from: 'petadopt38@gmail.com',
      to: 'maria.campan03@e-uvt.ro',
      subject: 'Cerere nouă de adoptie',
      html: `
      <body style="font-family: Arial, sans-serif;">

      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="text-align: center;">Confirmare cerere de adoptare</h2>
          
          <h3>Bună Maria,</h3>
          
          <h2>${req.body.firstName} ${req.body.lastName} doreste sa adopte animalul postat pe site: ${req.body.pet}</h2>
          <p>Mai jos puteti vedea informatiile de contact:</p>
          
          <h3>Informații Personale:</h3>
          <p>
              <strong>Nume:</strong> ${req.body.firstName} ${req.body.lastName} <br>
              <strong>Email:</strong> ${req.body.email} <br>
              <strong>Număr de telefon:</strong> ${req.body.phone} <br>
             
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
              <strong>Ați abandonat vreodată un animal de companie?</strong> ${req.body.abandon}<br>
              <strong>Aveți copii în locuință?</strong>  ${req.body.children}<br>
              <strong>Câte ore pe zi va fi animalul lăsat singur?</strong>  ${req.body.aloneTime}<br>
              <strong>Unde va sta animalul dvs. de companie în cazul în care trebuie să plecați din oraș?</strong> ${req.body.leave}<br>
              <strong>Cum veți gestiona problemele comportamentale ale animalului dvs.?</strong>  ${req.body.problems}<br>
              <strong>Ați fost vreodată condamnat pentru o infracțiune legată de animale?</strong>  ${req.body.crime}
          </p>
          
          <p>Vă mulțumim încă o dată pentru interesul dumneavoastră în adoptarea unui animal de companie. Vom analiza cererea dumneavoastră și vă vom contacta în cel mai scurt timp posibil.</p>
          
          <p>Cu stimă,<br>
          Echipa noastră de adopții</p>
      </div>
      `,
    };

    const mailOptionsToUser = {
      from: 'petadopt38@gmail.com',
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
              <strong>Ați abandonat vreodată un animal de companie?</strong> ${req.body.abandon}<br>
              <strong>Aveți copii în locuință?</strong>  ${req.body.children}<br>
              <strong>Câte ore pe zi va fi animalul lăsat singur?</strong>  ${req.body.aloneTime}<br>
              <strong>Unde va sta animalul dvs. de companie în cazul în care trebuie să plecați din oraș?</strong> ${req.body.leave}<br>
              <strong>Cum veți gestiona problemele comportamentale ale animalului dvs.?</strong>  ${req.body.problems}<br>
              <strong>Ați fost vreodată condamnat pentru o infracțiune legată de animale?</strong>  ${req.body.crime}
          </p>
          
          <p>Vă mulțumim încă o dată pentru interesul dumneavoastră în adoptarea unui animal de companie. Vom analiza cererea dumneavoastră și vă vom contacta în cel mai scurt timp posibil.</p>
          
          <p>Cu stimă,<br>
          Echipa noastră de adopții</p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptionsToPetOwner);
    await transporter.sendMail(mailOptionsToUser);

    console.log('Email sent successfully');
    res.status(201).send(savedForm);
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send({ message: 'Error submitting form' });
  }
});

export default formRouter;
