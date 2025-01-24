import styled from "styled-components";

export const BackgroundWithImage = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 480px;
  padding: 40px;
  backdrop-filter: blur(10px);
  
  @media (max-width: 600px) {
    padding: 20px;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FormContainer = styled.div`
  width: 100%;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #FF6B6B;
  text-align: center;
  margin-bottom: 20px;
  
  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    border-color: #FF6B6B;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1);
    outline: none;
  }
`;

export const Button = styled.button`
  background: #FF6B6B;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #FF5252;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const ToggleButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #FF6B6B;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
  
  &:hover {
    color: #FF5252;
  }
`;

export const Anchor = styled.a`
  color: #666;
  font-size: 0.9rem;
  text-align: right;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    color: #FF6B6B;
    text-decoration: underline;
  }
`;