import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaHeart, FaUserFriends } from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px; // Account for fixed header
`;

const Hero = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 30px;
`;

const Button = styled.button`
  background: #FF6B6B;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #FF5252;
    transform: translateY(-2px);
  }
`;

const ServicesSection = styled.section`
  padding: 80px 20px;
  background: #f8f9fa;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #333;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ServiceCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  color: #FF6B6B;
  margin-bottom: 20px;
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
`;

const ServiceDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const TestimonialsSection = styled.section`
  padding: 80px 20px;
  background: white;
`;

const TestimonialSlider = styled(Slider)`
  max-width: 1000px;
  margin: 0 auto;

  .slick-slide {
    padding: 0 15px;
  }
`;

const TestimonialCard = styled.div`
  background: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
`;

const TestimonialText = styled.p`
  font-style: italic;
  color: #666;
  margin-bottom: 20px;
`;

const TestimonialAuthor = styled.p`
  font-weight: bold;
  color: #333;
`;

function Home() {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <HomeContainer>
      <Hero>
        <HeroContent>
          <HeroTitle>Welcome to PetCare</HeroTitle>
          <HeroSubtitle>Your trusted partner in pet care and adoption</HeroSubtitle>
          <Button onClick={() => navigate('/pet-profile')}>Get Started</Button>
        </HeroContent>
      </Hero>

      <ServicesSection>
        <SectionTitle>Our Services</SectionTitle>
        <ServicesGrid>
          <ServiceCard>
            <ServiceIcon><FaPaw /></ServiceIcon>
            <ServiceTitle>Pet Profiles</ServiceTitle>
            <ServiceDescription>
              Create and manage detailed profiles for your beloved pets, keeping track of their needs and preferences.
            </ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <ServiceIcon><FaHeart /></ServiceIcon>
            <ServiceTitle>Pet Adoption</ServiceTitle>
            <ServiceDescription>
              Find your perfect companion through our network of trusted adoption centers and rescue organizations.
            </ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <ServiceIcon><FaUserFriends /></ServiceIcon>
            <ServiceTitle>Pet Community</ServiceTitle>
            <ServiceDescription>
              Connect with other pet lovers, share experiences, and get expert advice from our community.
            </ServiceDescription>
          </ServiceCard>
        </ServicesGrid>
      </ServicesSection>

      <TestimonialsSection>
        <SectionTitle>What Pet Parents Say</SectionTitle>
        <TestimonialSlider {...sliderSettings}>
          <TestimonialCard>
            <TestimonialText>
              "PetCare has made managing my pets' needs so much easier. The profile system is intuitive and helpful!"
            </TestimonialText>
            <TestimonialAuthor>- Sarah Johnson</TestimonialAuthor>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialText>
              "Thanks to PetCare, I found my perfect companion through their adoption center network."
            </TestimonialText>
            <TestimonialAuthor>- Michael Brown</TestimonialAuthor>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialText>
              "The community support and expert advice available here is invaluable for any pet parent."
            </TestimonialText>
            <TestimonialAuthor>- Emily Davis</TestimonialAuthor>
          </TestimonialCard>
        </TestimonialSlider>
      </TestimonialsSection>
    </HomeContainer>
  );
}

export default Home;