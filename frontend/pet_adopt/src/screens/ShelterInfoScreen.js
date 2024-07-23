import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useContext,
} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import MessageBox from '../components/MessageBox';
import Pet from '../components/Pet';
import Rating from '../components/Rating';
import { Store } from '../store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_SHELTER':
      return { ...state, shelter: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        shelter: action.payload.shelter,
        pets: action.payload.pets,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ShelterInfoScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reviewsRef = useRef();

  const [{ loading, error, shelter, pets, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      shelter: {},
      pets: [],
      loading: true,
      error: '',
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const postsHandler = () => {
    navigate(`/user/${shelter.user._id}/pets`);
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const shelterResult = await axios.get(`/api/shelters/${id}`);
        const petsResult = await axios.get(`/api/shelters/${id}/posts`);
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: { shelter: shelterResult.data, pets: petsResult.data },
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Selectează rating-ul și scrie recenzia');
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `/api/shelters/${shelter._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Recenzia s-a trimis cu succes.');
      shelter.reviews.unshift(data.review);
      shelter.numReviews = data.numReviews;
      shelter.rating = data.rating;
      dispatch({ type: 'REFRESH_SHELTER', payload: shelter });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

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
            {shelter.photos.map((photo, index) => (
              <Col key={index} xs={6} md={4}>
                <Card>
                  <Card.Img variant="top" src={photo} />
                </Card>
              </Col>
            ))}
          </Row>

          <Row>
            <Col>
              <h2>Animale disponibile</h2>
              {shelter.user && (
                <Button onClick={postsHandler} variant="light">
                  Vezi anunțuri
                </Button>
              )}
            </Col>
          </Row>
          <div className="my-3">
            <h2 ref={reviewsRef}>Recenzii</h2>
            <div className="mb-3">
              {shelter.reviews.length === 0 && (
                <MessageBox>Nu există recenzii încă.</MessageBox>
              )}
            </div>
            <ListGroup>
              {shelter.reviews.map((review, index) => (
                <ListGroup.Item key={index}>
                  <strong>{review.name}</strong>
                  <Rating rating={review.rating} caption=" " />
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="my-3">
              {userInfo ? (
                <form onSubmit={submitHandler}>
                  <h2>Scrie o recenzie</h2>
                  <Form.Group className="mb-3" controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select
                      aria-label="Rating"
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                    >
                      <option value="">Selectează...</option>
                      <option value="1">1- Foarte slab</option>
                      <option value="2">2- Slab</option>
                      <option value="3">3- Bun</option>
                      <option value="4">4- Foarte bun</option>
                      <option value="5">5- Excelent</option>
                    </Form.Select>
                  </Form.Group>
                  <FloatingLabel
                    controlId="floatingTextarea"
                    label="Comments"
                    className="mb-3"
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="Lasă un comentariu"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </FloatingLabel>
                  <div className="mb-3">
                    <Button type="submit">Trimite</Button>
                  </div>
                </form>
              ) : (
                <MessageBox>
                  Te rog{' '}
                  <Link to={`/signin?redirect=/product/${shelter.slug}`}>
                    intră în cont
                  </Link>{' '}
                  ca să lași o recenzie.
                </MessageBox>
              )}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

export default ShelterInfoScreen;
