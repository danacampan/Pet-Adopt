import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

function Pet(props) {
  const { pet } = props;
  return (
    <Card className="pet-card">
      <Link to={`/pet/${pet.slug}`}>
        <img src={pet.photos[0]} className="card-img-top" alt={pet.name} />
      </Link>
      <div className="pet-info">
        <Link className="name-link" to={`/pet/${pet.slug}`}>
          <p>
            <strong>{pet.name}</strong>
          </p>
        </Link>
        <div className="pet-tags">
          <p>{pet.age}</p>
          <p>{pet.gender}</p>
        </div>
        <p>{pet.address}</p>
      </div>
    </Card>
  );
}
export default Pet;
