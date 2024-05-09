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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToGDPR, setAgreedToGDPR] = useState(false); // Starea pentru acordul GDPR

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Parolele nu sunt la fel');
      return;
    }
    if (!agreedToGDPR) {
      // Verificarea dacă utilizatorul a acceptat GDPR
      toast.error('Trebuie să fii de acord cu Politica de Confidențialitate');
      return;
    }
    try {
      setLoading(true);

      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success(
        'Înregistrare reușită. Un email de confirmare a fost trimis.'
      );
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
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
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirmă parola</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form.Group>
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
          <Button type="submit" variant="light">
            Înregistare
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
