import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

const containerStyle = {
  display: 'flex',
  width: '800px',
  height: '500px',
  marginTop: '20px',
  marginRight: '20px',
  marginBottom: '30px',
  marginLeft: '150px',
};

const center = {
  lat: 45.759,
  lng: 21.2197,
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBqSxES0gUd7JoNggJUjnRh5bDS2JXjUZ4',
  });

  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [animalPosts, setAnimalPosts] = useState([]);
  const [filter, setFilter] = useState('animalPosts'); // Default filter
  const [selectedMarker, setSelectedMarker] = useState(null);

  const filters = [
    { name: 'Adăposturi', value: 'shelters' },
    { name: 'Anunțuri de animale', value: 'animalPosts' },
  ];

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await axios.get('/api/shelters');
        setShelters(response.data);
      } catch (error) {
        console.error('Error fetching shelters:', error);
      }
    };

    const fetchAnimalPosts = async () => {
      try {
        const response = await axios.get('/api/pets');
        setAnimalPosts(response.data);
      } catch (error) {
        console.error('Error fetching animal posts:', error);
      }
    };

    fetchShelters();
    fetchAnimalPosts();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const geocoder = new window.google.maps.Geocoder();
      const newMarkers = [];

      const itemsToMap = filter === 'shelters' ? shelters : animalPosts;

      itemsToMap.forEach((item, index) => {
        const address = item.address;
        const photos = item.photos;
        const user = item.user?.name;
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK') {
            const location = results[0].geometry.location;
            newMarkers.push({
              position: { lat: location.lat(), lng: location.lng() },
              title: item.name,
              id: index,
              id2: item._id,
              address: address,
              user: user,
              photos: photos,
            });
            if (index === itemsToMap.length - 1) {
              setMarkers(newMarkers);
            }
          } else {
            console.error(
              `Geocode was not successful for the following reason: ${status}`
            );
          }
        });
      });
    }
  }, [isLoaded, filter, shelters, animalPosts]);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  const customMarkerIcon = isLoaded
    ? {
        url: '/images/Paw.png',
        scaledSize: new window.google.maps.Size(60, 50),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(20, 20),
      }
    : null;

  return isLoaded ? (
    <Col>
      <h1 className="mb-5">Hartă</h1>

      <Form.Group controlId="filterDropdown" className="mb-3">
        <Form.Label>Selectează filtrul</Form.Label>
        <Form.Control
          as="select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filters.map((filterOption, idx) => (
            <option key={idx} value={filterOption.value}>
              {filterOption.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={customMarkerIcon}
            onClick={() => handleMarkerClick(marker)}
          >
            {selectedMarker === marker && (
              <InfoWindow
                onCloseClick={handleInfoWindowClose}
                position={marker.position}
              >
                <div>
                  <h6>{selectedMarker.title}</h6>
                  <p>
                    <strong>Adresă:</strong> {selectedMarker.address}
                  </p>
                  {selectedMarker.user && (
                    <p>
                      <strong>Utilizator:</strong> {selectedMarker.user}
                    </p>
                  )}
                  {selectedMarker.photos[0] && (
                    <img
                      src={selectedMarker.photos[0]}
                      alt="Poza"
                      style={{ width: '100px', height: '100px' }}
                    />
                  )}
                  <p>
                    <Link
                      to={
                        filter === 'shelters'
                          ? `/shelter/${encodeURIComponent(marker.id2)}`
                          : `/pet/${encodeURIComponent(marker.title)}`
                      }
                    >
                      Detalii
                    </Link>
                  </p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </Col>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
