import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pet from '../components/Pet';

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

function ShelterPostsScreen() {
  const { shelterId } = useParams();
  const [{ pets, loading, error }, dispatch] = useReducer(reducer, {
    pets: [],
    loading: false,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/pets/shelter/${shelterId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };

    fetchData();
  }, [shelterId]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <Row>
          {pets.map((pet) => (
            <Col key={pet.slug} sm={6} md={6} lg={3} className="mb-3">
              <Pet pet={pet}></Pet>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ShelterPostsScreen;
