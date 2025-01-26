import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import { toast } from "react-toastify"
import axios from "axios"

const PageContainer = styled.div`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
  background-color: #f8f9fa;
`

const ListContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`

const Title = styled.h1`
  font-size: 2.5rem;
  color: #FF6B6B;
  margin-bottom: 30px;
  text-align: center;
`

const PetCard = styled.div`
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
`

const PetImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
`

const PetInfo = styled.div`
  padding: 20px;
  flex-grow: 1;
`

const PetName = styled.h3`
  margin: 0 0 10px 0;
  color: #FF6B6B;
  font-size: 1.5rem;
`

const PetDetails = styled.p`
  margin: 0 0 5px 0;
  color: #666;
`

const PetDescription = styled.p`
  margin: 10px 0 0 0;
  color: #333;
  font-size: 0.9rem;
`

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #FF6B6B;
`

const AdoptionCenterPets = () => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { centerId } = useParams()

  useEffect(() => {
    fetchAdoptionCenterPets()
  }, [])

  const fetchAdoptionCenterPets = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log(`Fetching pets for center ID: ${centerId}`)

      const response = await axios.get(`http://localhost:8000/api/v1/adoption-center-pets/${centerId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      console.log("Full API Response:", response)
      if (response.data && response.data.statusCode === 200) {
        setPets(response.data.data)
        console.log("Pets data:", response.data.data)
      } else {
        console.error("Invalid data format:", response.data)
        throw new Error("Invalid data format received from the server")
      }
    } catch (error) {
      console.error("Detailed error:", error)
      setError(error.response?.data?.message || "Failed to fetch pets. Please try again later.")
      toast.error("Failed to fetch pets")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingMessage>Loading pets...</LoadingMessage>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <ListContainer>
        <Title>Adoption-Center Pets</Title>
        {pets.length > 0 ? (
          pets.map((pet) => (
            <PetCard key={pet._id}>
              <PetImage src={pet.imageUrl || "https://via.placeholder.com/150"} alt={pet.name} />
              <PetInfo>
                <PetName>{pet.name}</PetName>
                <PetDetails>Type: {pet.type}</PetDetails>
                <PetDetails>Breed: {pet.breed}</PetDetails>
                <PetDetails>Age: {pet.age} years</PetDetails>
                <PetDetails>Gender: {pet.gender}</PetDetails>
                <PetDescription>{pet.description}</PetDescription>
              </PetInfo>
            </PetCard>
          ))
        ) : (
          <p>No pets found for this adoption center.</p>
        )}
      </ListContainer>
    </PageContainer>
  )
}

export default AdoptionCenterPets

