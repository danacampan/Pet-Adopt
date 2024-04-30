import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Store } from '../store';

function Pet(props) {
  const { pet } = props;
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
  return (
    <Card className=" pet-card">
      <Link to={`/pet/${pet.slug}`}>
        <img src={pet.photos[0]} className="card-img-top" alt={pet.name} />
      </Link>

      <div className="pet-info">
        <Row>
          <Col>
            <Link
              className="be-vietnam-pro-semibold name-link"
              to={`/pet/${pet.slug}`}
            >
              <p>{pet.name}</p>
            </Link>
          </Col>
          <Col>
            <div className="favorite-button ">
              <Button
                className="favorite-button "
                onClick={addToFavoritesHandler}
                variant="dark"
              >
                <i className="fas fa-heart"></i>
              </Button>
            </div>
          </Col>
        </Row>

        <div className="pet-tags be-vietnam-pro-medium ">
          <p>{pet.age}</p>
          <p>{pet.breed}</p>
          <p>{pet.gender}</p>
        </div>
        <div className="d-flex flex-row px-2">
          <i style={{ color: '#919090' }} className="mt-3 fas fa-map"></i>
          <p style={{ color: '#919090' }} className="be-vietnam-pro-semibold">
            {pet.address}
          </p>
        </div>
      </div>
    </Card>
  );
}
export default Pet;
