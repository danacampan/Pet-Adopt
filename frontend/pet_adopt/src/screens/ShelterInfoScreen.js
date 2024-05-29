import React, { useState, useEffect, useReducer, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Pet from '../components/Pet';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { Store } from '../store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, pets: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ShelterInfoScreen() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shelter, setShelter] = useState({});
  const [{ pets }, dispatch] = useReducer(reducer, {
    pets: [],
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);

  useEffect(() => {
    const fetchShelterInfo = async () => {
      try {
        // Fetch shelter information using the shelter ID from the URL
        const { data: fetchedShelter } = await axios.get(`/api/shelters/${id}`);

        // Fetch pets associated with the shelter ID from the URL
        const { data: result } = await axios.get(`/api/shelters/${id}/posts`);

        dispatch({ type: 'FETCH_SUCCESS', payload: result });
        setShelter(fetchedShelter);
        setLoading(false);
      } catch (error) {
        setError('Eroare în obținerea informațiilor despre adăpost');
        setLoading(false);
      }
    };

    fetchShelterInfo();
  }, [id]);

  return (
    <Container>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col>
              <h1>{shelter.name}</h1>
              <Rating rating={shelter.rating} />
              <p>{shelter.address}</p>
              <p>{shelter.phone_number}</p>
              <p>{shelter.email}</p>
              <p>{shelter.description}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Animale disponibile</h2>
              <Link to={`/user/${shelter.user._id}/pets`}>Vezi anunturi</Link>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default ShelterInfoScreen;
