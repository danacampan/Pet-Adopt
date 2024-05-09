import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import PetScreen from './screens/PetScreen';
import { useContext } from 'react';
import { Store } from './store';
import FavoritesScreen from './screens/FavoritesScreen';
import SigninScreen from './screens/SignInScreen';
import AddPostScreen from './screens/AddPostScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignupScreen from './screens/SignUpScreen';
import MapScreen from './screens/MapScreen';
import AdoptFormScreen from './screens/AdoptFormScreen';
import ShelterInfoScreen from './screens/ShelterInfoScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { favorites, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('pets');
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container be-vietnam-pro-medium">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar className="navbar" variant="light">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Pet Adopt</Navbar.Brand>
              </LinkContainer>
              <Nav className=" me-auto w-100  justify-content-end">
                <Link to="/favorites" className="nav-link">
                  <i className="fas fa-heart"></i>
                  {favorites.favoritesItems.length > 0 && (
                    <Badge pill bg="danger">
                      {favorites.favoritesItems.length}
                    </Badge>
                  )}
                </Link>

                <Link to="/map" className="nav-link">
                  <i className="fas fa-map"></i>
                </Link>
                <Link className="nav-link" to="/addpost">
                  Adaugă anunț
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to={`/profile/${userInfo.name}`}>
                      <NavDropdown.Item>Profil</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Iesi din cont
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Autentificare
                  </Link>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/pet/:slug" element={<PetScreen />} />
              <Route path="/favorites" element={<FavoritesScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/addpost" element={<AddPostScreen />} />
              <Route path="/map" element={<MapScreen />} />
              <Route path="/form" element={<AdoptFormScreen />} />
              <Route path="/shelter/:name" element={<ShelterInfoScreen />} />
              <Route path="/profile/:name" element={<ProfileScreen />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center footer">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
