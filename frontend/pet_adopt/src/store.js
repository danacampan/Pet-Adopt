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
};
function reducer(state, action) {
  switch (action.type) {
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
      return { ...state, userInfo: null };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
