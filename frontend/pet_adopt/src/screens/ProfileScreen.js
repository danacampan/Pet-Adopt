import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { Store } from '../store';
import ListGroup from 'react-bootstrap/ListGroup';
import { getError } from '../utils';
import MessageBox from '../components/MessageBox';
import Chatbot from '../components/Chatbot';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        pets: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'TOGGLE_ADOPTION_REQUEST':
      return { ...state, loadingToggleAdoption: true };
    case 'TOGGLE_ADOPTION_SUCCESS':
      const updatedPets = state.pets.map((pet) =>
        pet._id === action.payload.petId
          ? { ...pet, adoption_status: action.payload.newStatus }
          : pet
      );
      return {
        ...state,
        pets: updatedPets,
        loadingToggleAdoption: false,
      };
    case 'TOGGLE_ADOPTION_FAIL':
      return { ...state, loadingToggleAdoption: false };
    default:
      return state;
  }
};

const ProfileScreen = () => {
  const [
    { loading, error, pets, successDelete, loadingToggleAdoption },
    dispatch,
  ] = useReducer(reducer, {
    pets: [],
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/pets/user', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
      fetchData();
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (petId) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`/api/pets/${petId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'DELETE_SUCCESS' });
        toast.success('Pet deleted successfully');
      } catch (err) {
        dispatch({ type: 'DELETE_FAIL' });
        toast.error(getError(err));
      }
    }
  };

  const toggleAdoptionStatus = async (petId, newStatus) => {
    dispatch({ type: 'TOGGLE_ADOPTION_REQUEST' });
    try {
      await axios.put(
        `/api/pets/${petId}`,
        { adoption_status: newStatus ? 'Disponibil' : 'Indisponibil' },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'TOGGLE_ADOPTION_SUCCESS',
        payload: { petId, newStatus },
      });
      toast.success('Actualizare status adoptie realizata cu succes');
    } catch (err) {
      dispatch({ type: 'TOGGLE_ADOPTION_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <h2 className="be-vietnam-pro-semibold">Animăluțele mele</h2>
          <br />
          <ListGroup>
            {pets.map((pet) => (
              <ListGroup.Item key={pet._id} className="mb-3">
                <h3>{pet.name}</h3>
                <p>{pet.description}</p>
                <Button
                  style={{ marginRight: '20px' }}
                  variant="danger"
                  onClick={() => deleteHandler(pet._id)}
                >
                  <i className="fas fa-trash"></i> Sterge
                </Button>

                <Button
                  variant={pet.adoption_status ? 'danger' : 'success'}
                  onClick={() =>
                    toggleAdoptionStatus(pet._id, !pet.adoption_status)
                  }
                  disabled={loadingToggleAdoption}
                >
                  {pet.adoption_status
                    ? 'Marcheaza ca indisponibil'
                    : 'Marcheaza ca disponibil'}
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Chatbot />
        </>
      )}
    </div>
  );
};

export default ProfileScreen;
