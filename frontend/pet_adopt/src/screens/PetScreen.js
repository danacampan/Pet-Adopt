import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import { Store } from '../store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, pet: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    //case 'PET_ADD_ITEM':
    //return { ...state, pet: [...state.pet, action.payload] };
    case 'USER_FETCH_SUCCESS':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

function PetScreen() {
  const navigate = useNavigate();
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
        //dispatch({ type: 'PET_ADD_ITEM', payload: result.data });
        dispatch({ type: 'USER_FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { favorites } = state;
  const addToFavoritesHandler = () => {
    const existItem = favorites.favoritesItems.find((x) => x._id === pet._id);
    if (!existItem) {
      ctxDispatch({ type: 'FAVORITES_ADD_ITEM', payload: pet });
    } else {
      window.alert('Ai adaugat deja acest animal la favorite');
    }
    //navigate('/favorites');
  };

  const adoptHandler = () => {
    navigate('/signin?redirect=/form');
  };

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      <Row className="d-flex justify-content-around">
        <Col className="secondary-img" md={3}>
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
        <Col className="petscreen-info be-vietnam-pro-medium " md={3} sm={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{pet.name}</title>
              </Helmet>
              <div className="d-flex flex-row justify-content-between">
                <h1>{pet.name}</h1>
                <div className="adopt-button ">
                  <Button onClick={addToFavoritesHandler} variant="dark">
                    <i className="fas fa-heart"></i>
                  </Button>
                </div>
              </div>
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
              <Col>
                <strong>Status: </strong>
                {pet.adoption_status === 'Disponibil' ? (
                  <Badge bg="success">Disponibil</Badge>
                ) : (
                  <Badge bg="danger">Indisponibil</Badge>
                )}
              </Col>
            </ListGroup.Item>
            <p className="mt-2 px-3 ">
              <strong>Utilizator:</strong> {pet.user.name}
            </p>
            {pet.adoption_status === 'Disponibil' && (
              <div className="adopt-button ">
                <Button onClick={adoptHandler} variant="light">
                  Adoptă acum!
                </Button>
              </div>
            )}
          </ListGroup>
        </Col>

        <Col md={3}></Col>
      </Row>
    </div>
  );
}
export default PetScreen;
