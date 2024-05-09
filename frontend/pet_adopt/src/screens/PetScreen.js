import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import { Store } from '../store';
import Carousel from 'react-bootstrap/Carousel';

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
      <Helmet>
        <title>{pet.name}</title>
      </Helmet>
      <div className="d-flex justify-content-between">
        <div
          style={{
            width: '100%',
            marginRight: '400px',
            marginTop: '20px',
            borderRadius: '20px',
          }}
        >
          <Carousel>
            {pet.photos.map((photo, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100 h-100"
                  src={photo}
                  alt={`Slide ${index}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        <div style={{ width: '50%' }}>
          <div className="petscreen-info be-vietnam-pro-medium">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="d-flex justify-content-between">
                  <h1>{pet.name}</h1>
                  <div className="adopt-button">
                    <Button onClick={addToFavoritesHandler} variant="dark">
                      <i className="fas fa-heart"></i>
                    </Button>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <strong>Vârstă:</strong> {pet.age}
              </li>
              <li className="list-group-item">
                <strong>Gen:</strong> {pet.gender}
              </li>
              <li className="list-group-item">
                <strong>Rasă:</strong> {pet.breed}
              </li>
              <li className="list-group-item">
                <strong>Adresă:</strong> {pet.address}
              </li>
              <li className="list-group-item">
                <strong>Informatii medicale:</strong> {pet.medical_info}
              </li>
              <li className="list-group-item">
                <strong>Descriere:</strong> {pet.description}
              </li>
              <li className="list-group-item">
                <strong>Status: </strong>
                {pet.adoption_status === 'Disponibil' ? (
                  <Badge bg="success">Disponibil</Badge>
                ) : (
                  <Badge bg="danger">Indisponibil</Badge>
                )}
              </li>
              <li className="list-group-item">
                <strong>Utilizator:</strong> {pet.user.name}
              </li>
            </ul>
            {pet.adoption_status === 'Disponibil' && (
              <div className="adopt-button">
                <Button onClick={adoptHandler} variant="light">
                  Adoptă acum!
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default PetScreen;
