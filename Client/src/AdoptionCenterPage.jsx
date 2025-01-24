import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: #FF6B6B;
  }
`;

const CenterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CenterCard = styled.div`
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CenterContent = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const CenterImageContainer = styled.div`
  flex: 0 0 200px;
  
  @media (max-width: 600px) {
    flex: 0 0 150px;
  }
`;

const CenterImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  
  @media (max-width: 600px) {
    height: 150px;
  }
`;

const CenterInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CenterName = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  color: #666;
  font-size: 1rem;

  svg {
    margin-right: 0.8rem;
    color: #FF6B6B;
  }
`;

const ViewMoreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: #FF6B6B;
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  margin-top: auto;
  width: fit-content;
  transition: all 0.3s ease;
  font-weight: 600;

  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    background-color: #FF5252;
    
    svg {
      transform: translateX(3px);
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #FF5252;
  background: #FFEBEE;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

function AdoptionCenterPage() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/adoption-centers");
        setCenters(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching adoption centers:", error);
        setError("Failed to load adoption centers. Please try again later.");
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  if (loading) {
    return <LoadingSpinner>Loading adoption centers...</LoadingSpinner>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <PageContainer>
      <Title>Adoption Centers</Title>
      <CenterList>
        {centers.map((center) => (
          <CenterCard key={center._id}>
            <CenterContent>
              <CenterImageContainer>
                <CenterImage 
                  src={center.imageUrl || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80"} 
                  alt={center.adoptionCenterName} 
                />
              </CenterImageContainer>
              <CenterInfo>
                <CenterName>{center.adoptionCenterName}</CenterName>
                <InfoItem>
                  <MapPin size={20} />
                  {center.address}
                </InfoItem>
                <InfoItem>
                  <Phone size={20} />
                  {center.contact}
                </InfoItem>
                <InfoItem>
                  <Mail size={20} />
                  {center.email}
                </InfoItem>
                <ViewMoreButton to={`/adoption-center/${center._id}`}>
                  View Available Pets
                  <ExternalLink size={16} />
                </ViewMoreButton>
              </CenterInfo>
            </CenterContent>
          </CenterCard>
        ))}
      </CenterList>
    </PageContainer>
  );
}

export default AdoptionCenterPage;