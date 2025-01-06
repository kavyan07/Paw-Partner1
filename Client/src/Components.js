import styled from "styled-components";
import BackgroundImage from "./animal-background.jpg"; // Path to your background image

// General Reset
export const Background = styled.div`
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    background-size: auto;
    background-position: center center;
  }
`;

export const Container = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  width: 100%;
  max-width: 400px;
  padding: 20px;

  @media (max-width: 600px) {
    max-width: 90%;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const FormContainer = styled.div`
  width: 100%;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

export const Button = styled.button`
  background-color: #ff4b2b;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #ff416c;
  }
`;

export const ToggleButtonContainer = styled.div`
  width: 100%;
  text-align: center;
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #ff4b2b;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #ff416c;
  }
`;

export const Anchor = styled.a`
  color: #555;
  font-size: 14px;
  text-align: right;
  display: block;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const RadioContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
`;

export const RadioLabel = styled.label`
  font-size: 16px;
  color: #555;
`;

export const RadioInput = styled.input`
  margin-right: 8px;
  cursor: pointer;
`;

