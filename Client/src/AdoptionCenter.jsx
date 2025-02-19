import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PageContainer = styled.div`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
  background-color: #f8f9fa;
`;

const ListContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #FF6B6B;
  margin-bottom: 30px;
  text-align: center;
`;

const CenterCard = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`;

const CenterImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
`;

const CenterInfo = styled.div`
  padding: 20px;
  flex-grow: 1;
`;

const CenterName = styled.h3`
  margin: 0 0 10px 0;
  color: #FF6B6B;
  font-size: 1.5rem;
`;

const CenterAddress = styled.p`
  margin: 0 0 10px 0;
  color: #666;
`;

const CenterDescription = styled.p`
  margin: 0;
  color: #333;
  font-size: 0.9rem;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #FF6B6B;
`;

const ViewMoreButton = styled.button`
  background-color: #FF6B6B;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #e55d5d;
  }
`;

const AdoptionCenter = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdoptionCenters();
  }, []);

  const fetchAdoptionCenters = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/v1/adoption-centers", {
        withCredentials: true,
      });
      console.log("API Response:", response);
      if (response.data.statusCode === 200 && Array.isArray(response.data.data)) {
        setCenters(response.data.data);
      } else {
        console.error("Invalid data format:", response.data);
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching adoption centers:", error);
      setError("Failed to fetch adoption centers. Please try again later.");
      toast.error("Failed to fetch adoption centers");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (centerId) => {
    navigate(`/adoption-center-pets/${centerId}`);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingMessage>Loading adoption centers...</LoadingMessage>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ListContainer>
        <Title>Adoption Centers</Title>
        {centers.length > 0 ? (
          centers.map((center) => (
            <CenterCard key={center._id}>
              <CenterImage src={center.imageUrl || "https://via.placeholder.com/150"} alt={center.adoptionCenterName} />
              <CenterInfo>
                <CenterName>{center.adoptionCenterName}</CenterName>
                <CenterAddress>{center.address}</CenterAddress>
                <CenterDescription>{center.adoptionCenterDescription}</CenterDescription>
                <ViewMoreButton onClick={() => handleViewMore(center._id)}>View More Pets</ViewMoreButton>
              </CenterInfo>
            </CenterCard>
          ))
        ) : (
          <p>No adoption centers found.</p>
        )}
      </ListContainer>
    </PageContainer>
  );
};

export default AdoptionCenter;
