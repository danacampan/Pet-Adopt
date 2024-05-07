import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await axios.get('/api/shelters');
        setShelters(response.data);
        console.log(shelters);
      } catch (error) {
        console.error('Error fetching shelters:', error);
      }
    };

    fetchShelters();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const geocoder = new window.google.maps.Geocoder();
      const newMarkers = [];

      shelters.forEach((shelter, index) => {
        const address = shelter.address;
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK') {
            const location = results[0].geometry.location;
            newMarkers.push({
              position: { lat: location.lat(), lng: location.lng() },
              title: shelter.name,
              id: index,
            });
            setMarkers([...newMarkers]);
          } else {
            console.error(
              `Geocode was not successful for the following reason: ${status}`
            );
          }
        });
      });
    }
  }, [isLoaded, shelters]);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMarkerClick = (shelter) => {
    //setSelectedMarker(marker);
    //navigate(`/shelter/${encodeURIComponent(shelterName)}`);
    setSelectedMarker(shelter);
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
    <Col className>
      <h1 className="mb-5">Hartă</h1>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.map((marker, index) => (
          <Marker
            position={marker.position}
            icon={customMarkerIcon}
            onClick={() => handleMarkerClick(marker)}
          >
            {selectedMarker === marker && (
              <InfoWindow onCloseClick={handleInfoWindowClose}>
                <div>
                  <Link
                    className="be-vietnam-pro-semibold name-link"
                    to="/shelter/:name"
                  >
                    <p>{marker.name}</p>
                  </Link>
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
