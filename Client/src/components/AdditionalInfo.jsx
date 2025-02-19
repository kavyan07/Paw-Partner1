import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Phone, MapPin, Loader2, XCircle } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 480px;
  padding: 40px;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #FF6B6B;
  text-align: center;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid ${props => props.error ? '#FF4444' : '#E0E0E0'};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #FF6B6B;
    outline: none;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Button = styled.button`
  background: #FF6B6B;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    background: #FF5252;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.2);
  }

  &:disabled {
    background: #E0E0E0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    animation: ${props => props.loading ? 'spin 1s linear infinite' : 'none'};
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.span`
  color: #FF4444;
  font-size: 0.85rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

function AdditionalInfo() {
    const [formData, setFormData] = useState({
        contact: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.contact.trim()) {
            newErrors.contact = "Contact number is required";
        } else if (!/^\d{10}$/.test(formData.contact.replace(/\D/g, ''))) {
            newErrors.contact = "Invalid contact number";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.patch(
                'http://localhost:8000/api/v1/users/update-user',
                formData,
                { withCredentials: true }
            );

            if (response.data.success) {
                window.location.href = '/home';
            }
        } catch (error) {
            setErrors({
                submit: error.response?.data?.message || "An error occurred while updating information"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <FormContainer>
                <Title>Additional Information</Title>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <InputIcon>
                            <Phone />
                        </InputIcon>
                        <Input
                            type="tel"
                            name="contact"
                            placeholder="Contact Number"
                            value={formData.contact}
                            onChange={handleInputChange}
                            error={errors.contact}
                            required
                        />
                        {errors.contact && (
                            <ErrorMessage>
                                <XCircle />
                                {errors.contact}
                            </ErrorMessage>
                        )}
                    </InputGroup>

                    <InputGroup>
                        <InputIcon>
                            <MapPin />
                        </InputIcon>
                        <Input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleInputChange}
                            error={errors.address}
                            required
                        />
                        {errors.address && (
                            <ErrorMessage>
                                <XCircle />
                                {errors.address}
                            </ErrorMessage>
                        )}
                    </InputGroup>

                    {errors.submit && (
                        <ErrorMessage>
                            <XCircle />
                            {errors.submit}
                        </ErrorMessage>
                    )}

                    <Button type="submit" loading={loading} disabled={loading}>
                        {loading ? <Loader2 /> : 'Save Information'}
                    </Button>
                </Form>
            </FormContainer>
        </Container>
    );
}

export default AdditionalInfo;