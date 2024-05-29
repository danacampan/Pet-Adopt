import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../store';
import { toast } from 'react-toastify';

import { getError } from '../utils';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isShelter, setIsShelter] = useState(false);
  const [shelterInfo, setShelterInfo] = useState({
    name: '',
    address: '',
    phone_number: '',
    description: '',
    photos: [],
  });

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const photosArray = files.map((file) => URL.createObjectURL(file)); // Generăm URL-uri pentru previzualizare
    setShelterInfo({ ...shelterInfo, photos: photosArray });
  };

  const [agreedToGDPR, setAgreedToGDPR] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Parolele nu sunt la fel');
      return;
    }
    if (!agreedToGDPR) {
      toast.error('Trebuie să fii de acord cu Politica de Confidențialitate');
      return;
    }
    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
        isShelter,
        shelterInfo: isShelter ? shelterInfo : null,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Înregistrare</title>
      </Helmet>
      <h1 className="my-3 be-vietnam-pro-semibold">Înregistrare</h1>
      <Form className="be-vietnam-pro-medium" onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nume</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Parolă</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirmă parola</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="isShelter">
          <Form.Check
            type="checkbox"
            label="Înregistrare ca adăpost"
            checked={isShelter}
            onChange={(e) => setIsShelter(e.target.checked)}
          />
        </Form.Group>

        {isShelter && (
          <>
            <Form.Group className="mb-3" controlId="shelterName">
              <Form.Label>Nume Adăpost</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setShelterInfo({ ...shelterInfo, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="shelterAddress">
              <Form.Label>Adresă</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setShelterInfo({ ...shelterInfo, address: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="shelterPhoneNumber">
              <Form.Label>Număr de telefon</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setShelterInfo({
                    ...shelterInfo,
                    phone_number: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="shelterDescription">
              <Form.Label>Descriere</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e) =>
                  setShelterInfo({
                    ...shelterInfo,
                    description: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="shelterPhotos">
              <Form.Label>Fotografii</Form.Label>
              <Form.Control type="file" multiple onChange={handlePhotoUpload} />
            </Form.Group>
          </>
        )}

        <Form.Group controlId="gdprCheckbox" className="mb-3">
          <Form.Check
            type="checkbox"
            label={
              <>
                Sunt de acord cu{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Politica de Confidențialitate
                </a>
              </>
            }
            checked={agreedToGDPR}
            onChange={(e) => setAgreedToGDPR(e.target.checked)}
            required
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit" variant="light" disabled={loading}>
            {loading ? 'Înregistrare...' : 'Înregistrare'}
          </Button>
        </div>
        <div className="mb-3">
          Ai deja un cont?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Autentificare</Link>
        </div>
      </Form>
    </Container>
  );
}
