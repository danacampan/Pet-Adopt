import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Rating from '../components/Rating';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Store } from '../store';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
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
      return { ...state, shelter: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ShelterInfoScreen(props) {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const { name } = useParams();

  const [{ loading, error, shelter }, dispatch] = useReducer(reducer, {
    shelter: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/shelters/name/${name}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [name]);

  const { state } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Selectează rating-ul și scrie recenzia');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/shelters/${shelter._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Recenzia s-a trimis cu succes.');
      const updatedShelter = { ...shelter };
      updatedShelter.reviews.unshift(data.review);
      updatedShelter.numReviews = data.numReviews;
      updatedShelter.rating = data.rating;
      dispatch({ type: 'REFRESH_SHELTER', payload: updatedShelter });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <Container>
      <Row>
        <Col>
          <h1>{shelter.name}</h1>

          <Rating rating={shelter.rating} />
          <p>{shelter.address}</p>
          <p>{shelter.phone_number}</p>
          <p>{shelter.email}</p>
          <p>{shelter.description}</p>
        </Col>
        <Col>
          <Row>
            {shelter.photos.map((photo, index) => (
              <Col key={index} xs={6} md={4}>
                <Card>
                  <Card.Img variant="top" src={photo} />
                </Card>
              </Col>
            ))}
          </Row>
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
              <Rating rating={review.rating} caption=" "></Rating>
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
                  onChange={(e) => setRating(e.target.value)}
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
    </Container>
  );
}

export default ShelterInfoScreen;
