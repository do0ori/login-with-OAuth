import styled, { keyframes } from "styled-components";
import { FaSpinner } from "react-icons/fa";

interface LoadingSpinnerProps {
  size: number;
  color: string;
}

export const LoadingSpinner = ({ size, color }: LoadingSpinnerProps) => {
  return <LoadingSpinnerStyle size={size} color={color} />;
};

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinnerStyle = styled(FaSpinner)`
  font-size: ${({ size }) => size || "24px"};
  animation: ${spinAnimation} 1.2s linear infinite;
  color: ${({ color }) => color || "black"};
`;
