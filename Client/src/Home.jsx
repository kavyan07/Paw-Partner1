import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Heart, Clock, Moon, ShoppingBag, Stethoscope, Star, Quote } from 'lucide-react';

const HomeContainer = styled.div`
  min-height: 100vh;
`;

const Hero = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
  height: 100vh;
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
  font-size: 4rem;
  margin-bottom: 20px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Button = styled(Link)`
  background: #FF6B6B;
  color: white;
  text-decoration: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  &:hover {
    background: #FF5252;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
  }
`;

const ServicesSection = styled.section`
  padding: 100px 20px;
  background: #f8f9fa;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #333;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background: #FF6B6B;
    margin: 20px auto 0;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ServiceCard = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 60px;
    height: 60px;
    color: #FF6B6B;
    margin-bottom: 20px;
  }
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

const InfoSection = styled.section`
  padding: 100px 20px;
  background: #FF6B6B;
  color: white;
  text-align: center;
`;

const InfoText = styled.p`
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.5rem;
  line-height: 1.8;
  font-weight: 300;

  a {
    color: white;
    text-decoration: underline;
    font-weight: 600;

    &:hover {
      color: #FFD3D3;
    }
  }
`;

const ReviewsSection = styled.section`
  padding: 100px 20px;
  background: #f8f9fa;
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ReviewCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  position: relative;

  &::before {
    content: '"';
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 4rem;
    color: #FF6B6B;
    opacity: 0.2;
    font-family: serif;
  }
`;

const ReviewText = styled.p`
  color: #666;
  line-height: 1.8;
  margin-bottom: 20px;
  font-style: italic;
`;

const ReviewAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AuthorImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #FF6B6B;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: #333;
`;

const AuthorRole = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const Stars = styled.div`
  color: #FFD700;
  display: flex;
  gap: 2px;
  margin-bottom: 10px;
`;

const JoinSection = styled.section`
  padding: 100px 20px;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
              url('https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
`;

const JoinGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 40px auto 0;
`;

const JoinCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const JoinTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #FF6B6B;
`;

const JoinDescription = styled.p`
  margin-bottom: 25px;
  line-height: 1.6;
`;

const JoinButton = styled(Link)`
  display: inline-block;
  background: #FF6B6B;
  color: white;
  padding: 12px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #FF5252;
    transform: translateY(-2px);
  }
`;

function Home() {
  const navigate = useNavigate();

  const handleJoinClick = (role) => {
    navigate('/signup', { state: { selectedRole: role } });
  };

  return (
    <HomeContainer>
      <Hero>
        <HeroContent>
          <HeroTitle>Welcome to Paw-Partner</HeroTitle>
          <HeroSubtitle>Your trusted companion in pet care and adoption</HeroSubtitle>
          <Button to="/pet-profile">Get Started</Button>
        </HeroContent>
      </Hero>

      <ServicesSection>
        <SectionTitle>Our Services</SectionTitle>
        <ServicesGrid>
          <ServiceCard>
            <PawPrint />
            <ServiceTitle>Pet Profile</ServiceTitle>
            <ServiceDescription>
              Create and manage detailed profiles for your beloved pets, tracking their needs and preferences.
            </ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <Heart />
            <ServiceTitle>Pet Adoption</ServiceTitle>
            <ServiceDescription>
              Find your perfect companion through our trusted network of adoption centers.
            </ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <ShoppingBag />
            <ServiceTitle>Pet Shop</ServiceTitle>
            <ServiceDescription>
              Access quality pet supplies, food, and accessories for your furry friends.
            </ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <Clock />
            <ServiceTitle>Pet Sitting</ServiceTitle>
            <ServiceDescription>
              Professional pet sitting services when you need to be away.
            </ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <Moon />
            <ServiceTitle>Overnight Care</ServiceTitle>
            <ServiceDescription>
              24/7 attention and care for your pets in a comfortable environment.
            </ServiceDescription>
          </ServiceCard>

          <ServiceCard>
            <Stethoscope />
            <ServiceTitle>Health Care</ServiceTitle>
            <ServiceDescription>
              Regular health check-ups and medical assistance for your pets.
            </ServiceDescription>
          </ServiceCard>
        </ServicesGrid>
      </ServicesSection>

      <ReviewsSection>
        <SectionTitle>What Pet Parents Say</SectionTitle>
        <ReviewsGrid>
          <ReviewCard>
            <Stars>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#FFD700" />
              ))}
            </Stars>
            <ReviewText>
              "Paw-Partner has been a game-changer for me and my pets. The pet profile feature helps me keep track of everything, and the community is so supportive!"
            </ReviewText>
            <ReviewAuthor>
              <AuthorImage>SJ</AuthorImage>
              <AuthorInfo>
                <AuthorName>Sarah Johnson</AuthorName>
                <AuthorRole>Dog Parent</AuthorRole>
              </AuthorInfo>
            </ReviewAuthor>
          </ReviewCard>

          <ReviewCard>
            <Stars>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#FFD700" />
              ))}
            </Stars>
            <ReviewText>
              "As a cat mom, I love how easy it is to find reliable pet sitters and shop for supplies. The service is simply outstanding!"
            </ReviewText>
            <ReviewAuthor>
              <AuthorImage>EM</AuthorImage>
              <AuthorInfo>
                <AuthorName>Emily Martinez</AuthorName>
                <AuthorRole>Cat Parent</AuthorRole>
              </AuthorInfo>
            </ReviewAuthor>
          </ReviewCard>

          <ReviewCard>
            <Stars>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#FFD700" />
              ))}
            </Stars>
            <ReviewText>
              "Found my perfect furry companion through Paw-Partner's adoption center network. The process was smooth and the support was incredible!"
            </ReviewText>
            <ReviewAuthor>
              <AuthorImage>MB</AuthorImage>
              <AuthorInfo>
                <AuthorName>Michael Brown</AuthorName>
                <AuthorRole>Pet Parent</AuthorRole>
              </AuthorInfo>
            </ReviewAuthor>
          </ReviewCard>
        </ReviewsGrid>
      </ReviewsSection>

      <JoinSection>
        <SectionTitle>Join Our Growing Community</SectionTitle>
        <JoinGrid>
          <JoinCard>
            <JoinTitle>Pet Shop Partners</JoinTitle>
            <JoinDescription>
              Expand your reach and connect with pet parents in your area. Join our network of trusted pet supply providers.
            </JoinDescription>
            <JoinButton onClick={() => handleJoinClick('petShop')}>
              Learn More
            </JoinButton>
          </JoinCard>

          <JoinCard>
            <JoinTitle>Adoption Centers</JoinTitle>
            <JoinDescription>
              Help more pets find their forever homes. Partner with us to increase visibility and adoption rates.
            </JoinDescription>
            <JoinButton onClick={() => handleJoinClick('adoptionCenter')}>
              Learn More
            </JoinButton>
          </JoinCard>
        </JoinGrid>
      </JoinSection>

      <InfoSection>
        <InfoText>
          Ready to give your pet the care they deserve? Join Paw-Partner today and experience the difference!{' '}
          <Link to="/pet-profile">Get started now</Link> and become part of our loving pet community.
        </InfoText>
      </InfoSection>
    </HomeContainer>
  );
}

export default Home;

