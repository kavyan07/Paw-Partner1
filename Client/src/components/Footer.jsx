import styled from "styled-components"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

const FooterContainer = styled.footer`
  background-color: #232F3E;
  color: #fff;
  padding: 4rem 0 2rem;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 0 20px;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #FF6B6B;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 30px;
    height: 2px;
    background: #FF6B6B;
    margin-top: 10px;
  }
`

const FooterLink = styled.a`
  color: #DDD;
  text-decoration: none;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    color: #FF6B6B;
    transform: translateX(5px);
  }
`

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`

const SocialIcon = styled.a`
  color: #DDD;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: #FF6B6B;
    transform: translateY(-3px);
  }
`

const Copyright = styled.p`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #444;
  font-size: 0.9rem;
  color: #AAA;
`

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <FooterTitle>About Us</FooterTitle>
          <FooterLink href="#">About Paw-Partner</FooterLink>
          <FooterLink href="#">Our Mission</FooterLink>
          <FooterLink href="#">Careers</FooterLink>
          <FooterLink href="#">Press</FooterLink>
        </FooterColumn>
        <FooterColumn>
          <FooterTitle>Services</FooterTitle>
          <FooterLink href="#">Pet Profiles</FooterLink>
          <FooterLink href="#">Pet Adoption</FooterLink>
          <FooterLink href="#">Pet Shop</FooterLink>
          <FooterLink href="#">Pet Care</FooterLink>
        </FooterColumn>
        <FooterColumn>
          <FooterTitle>Support</FooterTitle>
          <FooterLink href="#">Help Center</FooterLink>
          <FooterLink href="#">Safety Information</FooterLink>
          <FooterLink href="#">FAQs</FooterLink>
          <FooterLink href="#">Contact Us</FooterLink>
        </FooterColumn>
        <FooterColumn>
          <FooterTitle>Connect With Us</FooterTitle>
          <SocialIcons>
            <SocialIcon href="#">
              <Facebook />
            </SocialIcon>
            <SocialIcon href="#">
              <Twitter />
            </SocialIcon>
            <SocialIcon href="#">
              <Instagram />
            </SocialIcon>
            <SocialIcon href="#">
              <Youtube />
            </SocialIcon>
          </SocialIcons>
        </FooterColumn>
      </FooterContent>
      <Copyright>© {new Date().getFullYear()} Paw-Partner. All rights reserved.</Copyright>
    </FooterContainer>
  )
}

export default Footer

