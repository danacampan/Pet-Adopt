import { useContext } from 'react';
import { Store } from '../store';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Helmet } from 'react-helmet-async';
import ListGroup from 'react-bootstrap/ListGroup';
import MessageBox from '../components/MessageBox';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Chatbot from '../components/Chatbot';

export default function FavoritesScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    favorites: { favoritesItems },
  } = state;

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'FAVORITES_REMOVE_ITEM', payload: item });
  };

  return (
    <div>
      <Helmet>
        <title>Favorite</title>
      </Helmet>
      <h1 className="mb-4">Favorite</h1>
      <Col md={6} sm={12}>
        {favoritesItems === 0 ? (
          <MessageBox>
            Sectiunea este goala. <Link to="/">Cauta animale</Link>
          </MessageBox>
        ) : (
          <ListGroup>
            {favoritesItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row className="align-items-center">
                  <Col md={4}>
                    <img
                      src={item.photos[0]}
                      alt={item.name}
                      className="img-fluid rounded img-thumbnail"
                    ></img>{' '}
                  </Col>
                  <Col>
                    <Link to={`/pet/${item.slug}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>
                    <Button
                      onClick={() => removeItemHandler(item)}
                      variant="light"
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Chatbot />
    </div>
  );
}
