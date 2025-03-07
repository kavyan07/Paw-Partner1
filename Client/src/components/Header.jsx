"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { PawPrint, Heart, ShoppingBag, LogOut, Menu, X } from "lucide-react"

const HeaderContainer = styled.header`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
`

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

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
`

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
`

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: #FF6B6B;
    background: rgba(255, 107, 107, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
    color: #FF6B6B;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
    
    &:hover {
      background: rgba(255, 107, 107, 0.1);
    }
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #FF6B6B;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #FF5252;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem("token")

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/signin")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/home">
          <PawPrint />
          Paw-Partner
        </Logo>
        <NavLinks isOpen={isMenuOpen}>
          <NavLink to="/pet-profile" onClick={() => setIsMenuOpen(false)}>
            <PawPrint />
            Pet Profile
          </NavLink>
          <NavLink to="/adoption-centers" onClick={() => setIsMenuOpen(false)}>
            <Heart />
            Adoption Centers
          </NavLink>
          <NavLink to="/pet-shops" onClick={() => setIsMenuOpen(false)}>
            <ShoppingBag />
            Pet Shop
          </NavLink>
          {isLoggedIn ? (
            <NavLink to="#" onClick={handleLogout}>
              <LogOut />
              Logout
            </NavLink>
          ) : (
            <NavLink to="/signin" onClick={() => setIsMenuOpen(false)}>
              <LogOut />
              Sign In
            </NavLink>
          )}
        </NavLinks>
        <MobileMenuButton onClick={toggleMenu}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</MobileMenuButton>
      </Nav>
    </HeaderContainer>
  )
}

export default Header

