import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, pet: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function PetScreen() {
  const params = useParams();
  const { slug } = params;
  const [{ loading, error, pet }, dispatch] = useReducer(reducer, {
    pet: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/pets/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [slug]);
  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      <Row className="d-flex justify-content-around">
        <Col className="secondary-img" md={3} sm={6}>
          <img className="img-fluid" src={pet.photos[1]} alt={pet.name}></img>
          <p></p>
          <img className="img-fluid" src={pet.photos[2]} alt={pet.name}></img>
        </Col>
        <Col md={6}>
          <img
            className="img-fluid img-large"
            src={pet.photos[0]}
            alt={pet.name}
          ></img>
        </Col>
        <Col className="petscreen-info" md={3} sm={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>{pet.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Vârstă:</strong> {pet.age}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Gen:</strong> {pet.gender}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Rasă:</strong> {pet.breed}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Adresă:</strong> {pet.address}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Informatii medicale:</strong> {pet.medical_info}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Descriere:</strong> {pet.description}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Status:</strong> {pet.adoption_status}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}></Col>
      </Row>
    </div>
  );
}
export default PetScreen;
