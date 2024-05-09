import { createContext, useReducer } from 'react';
export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  favorites: {
    favoritesItems: localStorage.getItem('favoritesItems')
      ? JSON.parse(localStorage.getItem('favoritesItems'))
      : [],
  },
  pets: {
    petsItems: localStorage.getItem('petsItems')
      ? JSON.parse(localStorage.getItem('petsItems'))
      : [],
  },
  shelters: {
    sheltersItems: localStorage.getItem('sheltersItems')
      ? JSON.parse(localStorage.getItem('sheltersItems'))
      : [],
  },
  form: {
    formItems: localStorage.getItem('formItems')
      ? JSON.parse(localStorage.getItem('formItems'))
      : [],
  },
};
function reducer(state, action) {
  switch (action.type) {
    case 'PET_ADD_ITEM':
      const newPet = action.payload;
      const existPet = state.pets.petsItems.find(
        (pet) => pet._id === newPet._id
      );
      const petsItems = existPet
        ? state.pets.pets.map((pet) =>
            pet._id === existPet._id ? newPet : pet
          )
        : [...state.pets.petsItems, newPet];
      localStorage.setItem('pets', JSON.stringify(petsItems));
      return { ...state, pets: { ...state.pets, petsItems } };
    case 'PET_REMOVE_ITEM': {
      const petsItems = state.pets.petsItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('petsItems', JSON.stringify(petsItems));
      return { ...state, pets: { ...state.pets, petsItems } };
    }

    case 'FAVORITES_ADD_ITEM':
      const newItem = action.payload;
      const existItem = state.favorites.favoritesItems.find(
        (item) => item._id === newItem._id
      );
      const favoritesItems = existItem
        ? state.favorites.favorites.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.favorites.favoritesItems, newItem];
      localStorage.setItem('favoritesItems', JSON.stringify(favoritesItems));
      return { ...state, favorites: { ...state.favorites, favoritesItems } };
    /*return {
        ...state,
        favorites: {
          ...state.favorites,
          favoritesItems: [...state.favorites.favoritesItems, action.payload],
        },
      }; */
    case 'FAVORITES_REMOVE_ITEM': {
      const favoritesItems = state.favorites.favoritesItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('favoritesItems', JSON.stringify(favoritesItems));
      return { ...state, favorites: { ...state.favorites, favoritesItems } };
    }
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        pets: {
          petsItems: {},
          favoritesItems: [],
        },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
