import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import PetProfile from './PetProfile';
import Header from './components/Header';
import Footer from './components/Footer';
import AdoptionCenter from "./AdoptionCenter";
import AdoptionCenterPets from './AdoptionCenterPets';
import PetShop from './PetShop';
import AdditionalInfo from './components/AdditionalInfo';
import AdoptionCenterDashboard from './AdoptionCenterDashboard';
import ForgotPassword from './Forgot-password';


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
        <Route path="/adoption-centers" element={<AdoptionCenter />} />
        <Route path="/adoption-center-pets/:centerId" element={<AdoptionCenterPets />} />
        <Route path="/pet-shops" element={<PetShop />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/additional-info" element={<AdditionalInfo />} />
        <Route path="/adoption-center/dashboard" element={<AdoptionCenterDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        
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

