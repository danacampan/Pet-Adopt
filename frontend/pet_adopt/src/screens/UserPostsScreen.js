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
      return {
        ...state,
        pets: action.payload.pets,
        user: action.payload.user,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function UserPostsScreen() {
  const { userId } = useParams();
  const [{ pets, user, loading, error }, dispatch] = useReducer(reducer, {
    pets: [],
    user: null,
    loading: false,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const petsResult = await axios.get(`/api/pets/user/${userId}`);
        const userResult = await axios.get(`/api/users/${userId}`);
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: { pets: petsResult.data, user: userResult.data },
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          <h2>Anunțurile postate de {user && user.name}:</h2>
          <Row>
            {pets.map((pet) => (
              <Col key={pet.slug} sm={6} md={6} lg={3} className="mb-3">
                <Pet pet={pet}></Pet>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}

export default UserPostsScreen;
