import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const CenterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const CenterCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CenterImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CenterInfo = styled.div`
  padding: 1.5rem;
`;

const CenterName = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #666;

  svg {
    margin-right: 0.5rem;
  }
`;

const ViewMoreButton = styled(Link)`
  display: inline-block;
  background-color: #FF6B6B;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #FF5252;
  }
`;

function AdoptionCenterPage() {
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/adoption-centers");
        setCenters(response.data.data);
      } catch (error) {
        console.error("Error fetching adoption centers:", error);
      }
    };

    fetchCenters();
  }, []);

  return (
    <PageContainer>
      <Title>Adoption Centers</Title>
      <CenterGrid>
        {centers.map((center) => (
          <CenterCard key={center._id}>
            <CenterImage 
              src={center.imageUrl || "/placeholder.svg"} 
              alt={center.adoptionCenterName} 
            />
            <CenterInfo>
              <CenterName>{center.adoptionCenterName}</CenterName>
              <InfoItem>
                <MapPin size={18} />
                {center.address}
              </InfoItem>
              <InfoItem>
                <Phone size={18} />
                {center.contact}
              </InfoItem>
              <InfoItem>
                <Mail size={18} />
                {center.email}
              </InfoItem>
              <ViewMoreButton to={`/adoption-center/${center._id}`}>
                View More <ExternalLink size={14} />
              </ViewMoreButton>
            </CenterInfo>
          </CenterCard>
        ))}
      </CenterGrid>
    </PageContainer>
  );
}

export default AdoptionCenterPage;