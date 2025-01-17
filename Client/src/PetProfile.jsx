import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const PetCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const AddPetCard = styled(PetCard)`
  justify-content: center;
  cursor: pointer;
  border: 2px dashed #FF6B6B;
  background: rgba(255, 107, 107, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
  }
`;

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
`;

const PetInfo = styled.div`
  text-align: center;
  width: 100%;
`;

const PetName = styled.h3`
  font-size: 1.5rem;
  color: #2C3E50;
  margin: 0.5rem 0;
`;

const PetDetail = styled.p`
  color: #666;
  margin: 0.25rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const EditButton = styled(Button)`
  background: #4CAF50;
  color: white;
  
  &:hover {
    background: #45a049;
  }
`;

const DeleteButton = styled(Button)`
  background: #FF5252;
  color: white;
  
  &:hover {
    background: #ff3333;
  }
`;

const ErrorMessage = styled.div`
  color: #FF5252;
  background: #FFEBEE;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

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
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

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
`;

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
`;

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
`;

function PetProfile() {
  const [pets, setPets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    description: '',
    image: null
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/v1/owned-pets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPets(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch pets');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        formDataToSend.append('image', formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      if (editingPet) {
        await axios.patch(
          `http://localhost:8000/api/v1/owned-pets/update/${editingPet._id}`,
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
      } else {
        await axios.post(
          'http://localhost:8000/api/v1/owned-pets/add',
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
      }
      fetchPets();
      setIsModalOpen(false);
      setEditingPet(null);
      setFormData({
        name: '',
        type: 'Dog',
        breed: '',
        age: '',
        gender: 'Male',
        description: '',
        image: null
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save pet');
    }
  };

  const handleDelete = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/v1/owned-pets/delete/${petId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPets();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete pet');
      }
    }
  };

  return (
    <ProfileContainer>
      <h1>My Pets</h1>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <PetGrid>
        <AddPetCard onClick={() => {
          setIsModalOpen(true);
          setEditingPet(null);
          setFormData({
            name: '',
            type: 'Dog',
            breed: '',
            age: '',
            gender: 'Male',
            description: '',
            image: null
          });
        }}>
          <span style={{ fontSize: '3rem', color: '#FF6B6B' }}>+</span>
          <p>Add New Pet</p>
        </AddPetCard>
        
        {pets.map(pet => (
          <PetCard key={pet._id}>
            <PetImage>
              <img src={pet.imageUrl} alt={pet.name} />
            </PetImage>
            <PetInfo>
              <PetName>{pet.name}</PetName>
              <PetDetail>{pet.type} • {pet.breed}</PetDetail>
              <PetDetail>{pet.age} years • {pet.gender}</PetDetail>
              <PetDetail>{pet.description}</PetDetail>
              <ButtonGroup>
                <EditButton onClick={() => {
                  setEditingPet(pet);
                  setFormData({
                    name: pet.name,
                    type: pet.type,
                    breed: pet.breed,
                    age: pet.age,
                    gender: pet.gender,
                    description: pet.description,
                    image: null
                  });
                  setIsModalOpen(true);
                }}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete(pet._id)}>Delete</DeleteButton>
              </ButtonGroup>
            </PetInfo>
          </PetCard>
        ))}
      </PetGrid>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <h2>{editingPet ? 'Edit Pet' : 'Add New Pet'}</h2>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                name="name"
                placeholder="Pet Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
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
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
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
              <Input
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
                required={!editingPet}
              />
              <ButtonGroup>
                <EditButton type="submit">
                  {editingPet ? 'Update Pet' : 'Add Pet'}
                </EditButton>
                <DeleteButton type="button" onClick={() => {
                  setIsModalOpen(false);
                  setEditingPet(null);
                  setError('');
                }}>
                  Cancel
                </DeleteButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </ProfileContainer>
  );
}

export default PetProfile;