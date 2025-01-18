import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PawPrint, Heart, ShoppingBag, LogOut } from 'lucide-react';

const HeaderContainer = styled.header`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: #FF6B6B;
  
  svg {
    width: 32px;
    height: 32px;
    margin-right: 8px;
    color: #FF6B6B;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #FF6B6B;
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
    color: #FF6B6B;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/home">
          <PawPrint />
          Paw-Partner
        </Logo>
        <NavLinks>
          <NavLink to="/pet-profile">
            <PawPrint />
            Pet Profile
          </NavLink>
          <NavLink to="/adoption-center">
            <Heart />
            Pet Adoption
          </NavLink>
          <NavLink to="/pet-shop">
            <ShoppingBag />
            Pet Shop
          </NavLink>
          <NavLink to="/signin">
            <LogOut />
            Logout
          </NavLink>
        </NavLinks>
        <MobileMenuButton>☰</MobileMenuButton>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

