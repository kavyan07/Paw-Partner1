import React, { useState, useEffect } from "react"
import axios from "axios"
import styled from "styled-components"
import { Plus, X, Edit, Trash2, Loader } from "lucide-react"

const ProfileContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const PetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`

const PetCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`

const AddPetCard = styled(PetCard)`
  justify-content: center;
  cursor: pointer;
  border: 2px dashed #FF6B6B;
  background: rgba(255, 107, 107, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
  }
`

const PetImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const PetInfo = styled.div`
  text-align: center;
  width: 100%;
`

const PetName = styled.h3`
  font-size: 1.5rem;
  color: #2C3E50;
  margin: 0.5rem 0;
`

const PetDetail = styled.p`
  color: #666;
  margin: 0.25rem 0;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const EditButton = styled(Button)`
  background: #4CAF50;
  color: white;
  
  &:hover {
    background: #45a049;
  }
`

const DeleteButton = styled(Button)`
  background: #FF5252;
  color: white;
  
  &:hover {
    background: #ff3333;
  }
`

const ErrorMessage = styled.div`
  color: #FF5252;
  background: #FFEBEE;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`

const SuccessMessage = styled.div`
  color: #4CAF50;
  background: #E8F5E9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  position: relative;
`

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #FF5252;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    border-color: #FF6B6B;
    outline: none;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    border-color: #FF6B6B;
    outline: none;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    border-color: #FF6B6B;
    outline: none;
  }
`

function PetProfile() {
  const [pets, setPets] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    description: "",
    image: null,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/owned-pets/", {
        withCredentials: true,
      })
      setPets(response.data.data)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch pets")
    }
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const petData = {
      name: formData.name,
      type: formData.type,
      breed: formData.breed,
      age: formData.age,
      gender: formData.gender,
      description: formData.description,
    }

    try {
      let response
      if (editingPet) {
        response = await axios.patch(`http://localhost:8000/api/v1/owned-pets/update/${editingPet._id}`, petData, {
          withCredentials: true,
        })
        setSuccess("Pet updated successfully")
        setPets(pets.map((pet) => (pet._id === editingPet._id ? response.data.data : pet)))
      } else {
        response = await axios.post("http://localhost:8000/api/v1/owned-pets/add", petData, {
          withCredentials: true,
        })
        setSuccess("Pet added successfully")
        setPets([...pets, response.data.data])
      }
      setIsModalOpen(false)
      setEditingPet(null)
      setFormData({
        name: "",
        type: "",
        breed: "",
        age: "",
        gender: "",
        description: "",
        image: null,
      })
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save pet")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (pet) => {
    setEditingPet(pet)
    setFormData({
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      description: pet.description,
      image: null,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (petId) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/owned-pets/delete/${petId}`, {
          withCredentials: true,
        })
        setSuccess("Pet deleted successfully")
        setPets(pets.filter((pet) => pet._id !== petId))
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete pet")
      }
    }
  }

  return (
    <ProfileContainer>
      <h1>My Pets</h1>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      <PetGrid>
        <AddPetCard
          onClick={() => {
            setIsModalOpen(true)
            setEditingPet(null)
            setFormData({
              name: "",
              type: "",
              breed: "",
              age: "",
              gender: "",
              description: "",
              image: null,
            })
          }}
        >
          <Plus size={32} color="#FF6B6B" />
          <p>Add New Pet</p>
        </AddPetCard>

        {pets.map((pet) => (
          <PetCard key={pet._id}>
            <PetImage>
              <img src={pet.imageUrl || "/placeholder.svg"} alt={pet.name} />
            </PetImage>
            <PetInfo>
              <PetName>{pet.name}</PetName>
              <PetDetail>
                {pet.type} • {pet.breed}
              </PetDetail>
              <PetDetail>
                {pet.age} years • {pet.gender}
              </PetDetail>
              <PetDetail>{pet.description}</PetDetail>
              <ButtonGroup>
                <EditButton onClick={() => handleEdit(pet)}>
                  <Edit size={16} />
                  Edit
                </EditButton>
                <DeleteButton onClick={() => handleDelete(pet._id)}>
                  <Trash2 size={16} />
                  Delete
                </DeleteButton>
              </ButtonGroup>
            </PetInfo>
          </PetCard>
        ))}
      </PetGrid>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <CloseButton
              onClick={() => {
                setIsModalOpen(false)
                setEditingPet(null)
                setError("")
              }}
            >
              <X />
            </CloseButton>
            <h2>{editingPet ? "Edit Pet" : "Add New Pet"}</h2>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                name="name"
                placeholder="Pet Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Select name="type" value={formData.type} onChange={handleInputChange} required>
                <option value="">Select pet type</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Fish">Fish</option>
                <option value="Other">Other</option>
              </Select>
              <Input
                type="text"
                name="breed"
                placeholder="Breed"
                value={formData.breed}
                onChange={handleInputChange}
                required
              />
              <Input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
              <Select name="gender" value={formData.gender} onChange={handleInputChange} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
              <TextArea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <Input type="file" name="image" onChange={handleInputChange} accept="image/*" required={!editingPet} />
              <ButtonGroup>
                <EditButton type="submit" disabled={loading}>
                  {loading ? <Loader size={16} /> : editingPet ? "Update Pet" : "Add Pet"}
                </EditButton>
                <DeleteButton
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingPet(null)
                    setError("")
                  }}
                >
                  Cancel
                </DeleteButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </ProfileContainer>
  )
}

export default PetProfile

