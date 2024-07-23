import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Chatbot from '../components/Chatbot';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function AddPostScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    pets: { petsInfo },
  } = state;

  const navigate = useNavigate();
  const { search } = useLocation();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [medical_info, setMedical_Info] = useState('');
  const [adoptionStatus, setAdoptionStatus] = useState('Disponibil');
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/addpost');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const photosArray = [];
    for (let i = 0; i < photos.length; i++) {
      if (photos[i].size > MAX_FILE_SIZE) {
        toast.error(
          'Fiecare fotografie trebuie să fie mai mică de 2MB. Alegeți alte fotografii.'
        );
        return;
      }
    }

    try {
      for (let i = 0; i < photos.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(photos[i]);
        reader.onload = () => {
          photosArray.push(reader.result);
          if (photosArray.length === photos.length) {
            sendRequestWithPhotos(photosArray);
          }
        };
      }
    } catch (err) {
      console.error(err);
      toast.error('Eroare la procesarea fotografiilor.');
    }
  };

  const sendRequestWithPhotos = async (photosArray) => {
    try {
      const response = await axios.post('/api/pets/addpost', {
        name,
        slug,
        age,
        breed,
        gender,
        address,
        description,
        medical_info,
        adoptionStatus,
        photos: photosArray,
        user: userInfo._id,
      });
      if (response.status === 201) {
        const newPet = response.data;
        ctxDispatch({ type: 'PET_ADD_ITEM', payload: newPet });
        toast.success('Animalul a fost adăugat cu succes!');

        setName('');
        setSlug('');
        setAge('');
        setBreed('');
        setGender('');
        setAddress('');
        setDescription('');
        setMedical_Info('');
        setAdoptionStatus('Disponibil');
        setPhotos([]);
        navigate('/');
      } else {
        toast.error('Eroare la adăugarea animalului.');
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Container className="small-container white-container">
      <Helmet>
        <title>Adaugă anunț</title>
      </Helmet>
      <h1 className="my-30 be-vietnam-pro-semibold">Adaugă anunț</h1>
      <Form className="be-vietnam-pro-medium" onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Numele animalutului</Form.Label>
          <Form.Control
            value={name}
            required
            onChange={(e) => {
              setName(e.target.value);
              setSlug(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="age">
          <Form.Label>Vârsta</Form.Label>
          <Form.Control
            as="select"
            value={age}
            required
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="">Alegeți vârsta</option>
            <option value="Pui">Pui (câteva luni)</option>
            <option value="Adult">Adult (câțiva ani)</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="breed">
          <Form.Label>Rasa</Form.Label>
          <Form.Control
            value={breed}
            required
            onChange={(e) => setBreed(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="gender">
          <Form.Label>Sexul</Form.Label>
          <Form.Control
            as="select"
            value={gender}
            required
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Alegeți sexul</option>
            <option value="Feminin">Feminin</option>
            <option value="Masculin">Masculin</option>
            <option value="Necunoscut">Necunoscut</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Adresă</Form.Label>
          <Form.Control
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Descriere</Form.Label>
          <Form.Control
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="medicalInfo">
          <Form.Label>Informatii medicale</Form.Label>
          <Form.Control
            value={medical_info}
            required
            onChange={(e) => setMedical_Info(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="photos">
          <Form.Label>Încarcă poze</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={(e) => setPhotos(e.target.files)}
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit" variant="light">
            Salveaza
          </Button>
        </div>
      </Form>
      <Chatbot />
    </Container>
  );
}
