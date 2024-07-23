import React, { useContext, useReducer, useState } from 'react';
import AddPostScreen from './AddPostScreen';
import axios, { Axios } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Store } from '../store';
import { toast } from 'react-toastify';
import Chatbot from '../components/Chatbot';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false, form: action.payload };
    case 'CREATE_FAIL':
      return { ...state, loading: false };

    default:
      return state;
  }
};

const AdoptFormScreen = () => {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pet: '',
    address: '',
    city: '',
    county: '',
    zip: '',
    country: '',
    ownPets: '',
    homeOwnership: '',
    yard: '',
    landlordPolicy: '',
    abandon: '',
    children: '',
    aloneTime: '',
    leave: '',
    problems: '',
    crime: '',
    agreement1: '',
    agreement2: '',
    agreement3: '',
    agreement4: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/forms', formData);
      console.log('Form data sent to server:', data);

      const emailData = {
        recipient: 'petadopt38@gmail.com',
        subject: 'Formular de cerere pentru adopție',
        html: `
        <body style="font-family: Arial, sans-serif;">

        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="text-align: center;">Confirmare cerere de adoptare</h2>
            
            <p>Bună ${formData.firstName},</p>
            
            <p>Îți mulțumim că ai completat formularul nostru pentru adoptarea unui animal de companie. Mai jos găsești un rezumat al informațiilor furnizate:</p>
            
            <h3>Informații Personale:</h3>
            <p>
                <strong>Nume:</strong> ${formData.firstName} ${formData.lastName} <br>
                <strong>Email:</strong> ${formData.email} <br>
                <strong>Număr de telefon:</strong> ${formData.phone} <br>
                <strong>Numele animalului pe care doriți să-l adoptați:</strong> ${formData.pet}
            </p>
            
            <h3>Adresă:</h3>
            <p>
                ${formData.address}<br>
                ${formData.city}, ${formData.county}<br>
                <strong>Cod poștal:</strong> ${formData.zip}<br>
                <strong>Țară:</strong> ${formData.country}
            </p>
            
            <h3>Alte detalii:</h3>
            <p>
                <strong>Dețineți alte animale de companie?</strong> ${formData.ownPets}<br>
                <strong>Locuiți în chirie sau dețineți casa?</strong> ${formData.homeOwnership}<br>
                <strong>Aveți curte?</strong> ${formData.yard}<br>
                <strong>Politica proprietarului referitoare la animalele de companie:</strong> ${formData.landlordPolicy}<br>
                <strong>Ați abandonat vreodată un animal de companie?</strong> ${formData.abandon}<br>
                <strong>Aveți copii în locuință?</strong>  ${formData.children}<br>
                <strong>Câte ore pe zi va fi animalul lăsat singur?</strong>  ${formData.aloneTime}<br>
                <strong>Unde va sta animalul dvs. de companie în cazul în care trebuie să plecați din oraș?</strong> ${formData.leave}<br>
                <strong>Cum veți gestiona problemele comportamentale ale animalului dvs.?</strong>  ${formData.problems}<br>
                <strong>Ați fost vreodată condamnat pentru o infracțiune legată de animale?</strong>  ${formData.crime}
            </p>
            
            <p>Vă mulțumim încă o dată pentru interesul dumneavoastră în adoptarea unui animal de companie. Vom analiza cererea dumneavoastră și vă vom contacta în cel mai scurt timp posibil.</p>
            
            <p>Cu stimă,<br>
            Echipa noastră de adopții</p>
        </div>
        `,
      };

      await axios.post('/api/send-email', emailData);
      console.log('Email sent successfully');
      navigate('/');
      toast.success('Email-ul a fost trimis cu succes!');
      setFormData({});
    } catch (error) {
      console.log('Error submitting form:', error);
    }
  };

  return (
    <div className="white-container" style={{ marginLeft: '100px' }}>
      <h2>Formular de Cerere pentru Adoptarea unui Animal de Companie</h2>
      <form onSubmit={handleSubmit}>
        <h3>Informații Personale:</h3>
        <label htmlFor="firstName">Prenume:</label>
        <br />
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="lastName">Nume:</label>
        <br />
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="email">Email:</label>
        <br />
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="phone">Numar telefon:</label>
        <br />
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="pet">
          Numele Animalului pe care Doriți să-l Adoptați:
        </label>
        <br />
        <input
          type="text"
          id="pet"
          name="pet"
          value={formData.pet}
          onChange={handleChange}
          required
        />
        <br />

        <h3>Adresă:</h3>
        <label htmlFor="address">Adresă:</label>
        <br />
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="city">Oraș:</label>
        <br />
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="county">Județ:</label>
        <br />
        <input
          type="text"
          id="county"
          name="county"
          value={formData.county}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="zip">Cod Poștal:</label>
        <br />
        <input
          type="text"
          id="zip"
          name="zip"
          value={formData.zip}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="country">Țară:</label>
        <br />
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
        />
        <br />

        <h3>Informații Suplimentare:</h3>
        <label htmlFor="ownPets">Dețineți alte animale de companie?</label>
        <br />
        <input
          type="radio"
          id="yesPets"
          name="ownPets"
          value="Da"
          checked={formData.ownPets === 'Da'}
          onChange={handleChange}
          required
        />
        <label htmlFor="yesPets">Da</label>
        <br />
        <input
          type="radio"
          id="noPets"
          name="ownPets"
          value="Nu"
          checked={formData.ownPets === 'Nu'}
          onChange={handleChange}
          required
        />
        <label htmlFor="noPets">Nu</label>
        <br />

        <label htmlFor="homeOwnership">
          Locuiți în chirie sau dețineți casa?
        </label>
        <br />
        <input
          type="radio"
          id="Inchiriez"
          name="homeOwnership"
          value="rent"
          checked={formData.homeOwnership === 'Inchirez'}
          onChange={handleChange}
          required
        />
        <label htmlFor="rent">Chirie</label>
        <br />
        <input
          type="radio"
          id="own"
          name="homeOwnership"
          value="Detin"
          checked={formData.homeOwnership === 'Detin'}
          onChange={handleChange}
          required
        />
        <label htmlFor="own">Dețin</label>
        <br />

        <label htmlFor="yard">Aveți curte?</label>
        <br />
        <input
          type="radio"
          id="yesYard"
          name="yard"
          value="Da"
          checked={formData.yard === 'Da'}
          onChange={handleChange}
          required
        />
        <label htmlFor="yesYard">Da</label>
        <br />
        <input
          type="radio"
          id="noYard"
          name="yard"
          value="Nu"
          checked={formData.yard === 'Nu'}
          onChange={handleChange}
          required
        />
        <label htmlFor="noYard">Nu</label>
        <br />

        <label htmlFor="landlordPolicy">
          Care este politica proprietarului referitoare la animalele de
          companie?
        </label>
        <br />
        <textarea
          id="landlordPolicy"
          name="landlordPolicy"
          value={formData.landlordPolicy}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>
        <br />

        <label htmlFor="abandon">
          Ați abandonat vreodată un animal de companie la un adăpost pentru
          animale (inclusiv cu eutanasiere sau fără), pe stradă sau în alte
          locuri?
        </label>
        <br />
        <input
          type="radio"
          id="yesAbandon"
          name="abandon"
          value="Da"
          checked={formData.abandon === 'Da'}
          onChange={handleChange}
          required
        />
        <label htmlFor="yesAbandon">Da</label>
        <br />
        <input
          type="radio"
          id="noAbandon"
          name="abandon"
          value="Nu"
          checked={formData.abandon === 'Nu'}
          onChange={handleChange}
          required
        />
        <label htmlFor="noAbandon">Nu</label>
        <br />

        <label htmlFor="children">
          Aveți copii în locuință?(Dacă da, vă rugăm introduceți vârstele)
        </label>
        <br />
        <textarea
          id="children"
          name="children"
          value={formData.children}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>
        <br />

        <h3>Îngrijire și Program:</h3>

        <label htmlFor="aloneTime">
          Câte ore pe zi va fi animalul lăsat singur?
        </label>
        <br />
        <textarea
          id="aloneTime"
          name="aloneTime"
          value={formData.aloneTime}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>
        <br />

        <label htmlFor="leave">
          Dacă trebuie să plecați din oraș, fie în mod planificat, fie de
          urgență, unde va sta animalul dvs. de companie?
        </label>
        <br />
        <textarea
          id="leave"
          name="leave"
          value={formData.leave}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>
        <br />

        <label htmlFor="problems">
          Cum veți gestiona problemele comportamentale precum lătratul,
          mestecatul, comportamentul distructiv, accidentele în casă,
          comportamentul nesupus la plimbare cu lesa al animalului dvs.?
        </label>
        <br />
        <textarea
          id="problems"
          name="problems"
          value={formData.problems}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>
        <br />

        <h3>Ilegalități legate de Animale:</h3>

        <label htmlFor="crime">
          Ați fost vreodată condamnat pentru o infracțiune legată de animale,
          cum ar fi cruzimea față de animale, furtul de animale sau abandonul de
          animale?
        </label>
        <br />
        <input
          type="radio"
          id="yesCrime"
          name="crime"
          value="Da"
          checked={formData.crime === 'Da'}
          onChange={handleChange}
          required
        />
        <label htmlFor="yesCrime">Da</label>
        <br />
        <input
          type="radio"
          id="noCrime"
          name="crime"
          value="Nu"
          checked={formData.crime === 'Nu'}
          onChange={handleChange}
          required
        />
        <label htmlFor="noCrime">Nu</label>
        <br />

        <h3>Acorduri:</h3>
        <input
          type="checkbox"
          id="agreement1"
          name="agreement1"
          checked={formData.agreement1}
          onChange={handleChange}
          required
        />
        <label htmlFor="agreement1">
          Sunt de acord să particip la procesul de adopție.
        </label>
        <br />
        <input
          type="checkbox"
          id="agreement2"
          name="agreement2"
          checked={formData.agreement2}
          onChange={handleChange}
          required
        />
        <label htmlFor="agreement2">
          Înțeleg că referințele mele vor fi verificate, inclusiv cele
          personale.
        </label>
        <br />
        <input
          type="checkbox"
          id="agreement3"
          name="agreement3"
          checked={formData.agreement3}
          onChange={handleChange}
          required
        />
        <label htmlFor="agreement3">
          Înțeleg că dacă nu mai doresc sau nu mai pot îngriji animalul de
          companie adoptat, voi notifica adăpostul și voi oferi un termen de 14
          zile pentru a permite adăpostului să facă aranjamente pentru preluarea
          animalului.
        </label>
        <br />
        <input
          type="checkbox"
          id="agreement4"
          name="agreement4"
          checked={formData.agreement4}
          onChange={handleChange}
          required
        />
        <label htmlFor="agreement4">
          Declar că toate informațiile de mai sus sunt adevărate și exacte.
        </label>
        <br />

        <input type="submit" value="Trimite Cererea" />
      </form>
      <Chatbot />
    </div>
  );
};

export default AdoptFormScreen;
