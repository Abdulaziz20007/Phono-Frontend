// app/profile/components/ui/SharedComponents.tsx
import styled from "styled-components";

// --- Modal styled components ---
export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 25px 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  min-width: 350px;
  max-width: 500px;
  position: relative;

  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.5em;
    color: #333;
  }
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #888;
  &:hover {
    color: #555;
  }
`;

export const Input = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
`;

// Button component
export const Button = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  margin-right: 10px;
  background-color: ${(props) =>
    props.$primary
      ? "#6a1b9a"
      : props.$danger
      ? "#e53935"
      : "#eee"};
  color: ${(props) =>
    props.$primary
      ? "white"
      : props.$danger
      ? "white"
      : "#333"};

  &:hover {
    opacity: 0.9;
  }
  &:last-child {
    margin-right: 0;
  }
`;

// Loading components
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

export const LoadingSpinner = styled.div`
  color: #6a1b9a;
  font-size: 32px;
  margin-bottom: 16px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorContainer = styled.div`
  background-color: #ffebee;
  border: 1px solid #ef9a9a;
  color: #c62828;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 10px;
  }
`;

export const RetryButton = styled(Button)`
  margin-top: 16px;
`;

// Page container components
export const ProfilePageContainer = styled.div`
  max-width: 960px;
  margin: 20px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
`;

export const Breadcrumbs = styled.div`
  font-size: 0.9em;
  color: #777;
  margin-bottom: 15px;
  a {
    color: #555;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ProfileHeader = styled.h1`
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;
