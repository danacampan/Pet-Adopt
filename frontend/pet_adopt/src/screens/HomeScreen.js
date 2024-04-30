import { Link } from 'react-router-dom';
//import data from '../data';
import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pet from '../components/Pet';
import { Helmet } from 'react-helmet-async';

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

function HomeScreen() {
  const [{ loading, error, pets }, dispatch] = useReducer(reducer, {
    pets: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/pets');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Pet Adopt</title>
      </Helmet>
      <h1 className="be-vietnam-pro-semibold">Animale disponibile</h1>
      <div className="pets">
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
    </div>
  );
}
export default HomeScreen;
