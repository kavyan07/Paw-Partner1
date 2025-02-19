import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import PetProfile from './PetProfile';
import AdditionalInfo from './AdditionalInfo';
import AdoptionCenterPage from './AdoptionCenterPage';
import Header from './components/Header';
import Footer from './components/Footer';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/';

  return (
    <>
      {!isAuthPage && <Header />}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pet-profile" element={<PetProfile />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/addional-info" element={<AdditionalInfo />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

