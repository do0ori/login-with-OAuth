import styled from "styled-components";
import { GET_CODE_URL } from "../apis/auth.api";

export const KakaoLoginButton = () => {
  const onClick = () => {
    window.location.href = GET_CODE_URL["kakao"];
  };

  return (
    <LoginButtonStyle
      id="kakao"
      $bgColor="#FEE500"
      $textColor="#000000"
      onClick={onClick}
    >
      카카오 로그인
    </LoginButtonStyle>
  );
};

export const NaverLoginButton = () => {
  const onClick = () => {
    window.location.href = GET_CODE_URL["naver"];
  };

  return (
    <LoginButtonStyle $bgColor="#03C75A" $textColor="#FFFFFF" onClick={onClick}>
      네이버 로그인
    </LoginButtonStyle>
  );
};

export const GoogleLoginButton = () => {
  const onClick = () => {
    window.location.href = GET_CODE_URL["google"];
  };

  return (
    <LoginButtonStyle $bgColor="#FFFFFF" $textColor="#000000" onClick={onClick}>
      구글 로그인
    </LoginButtonStyle>
  );
};

interface LoginButtonStyleProps {
  $bgColor: string;
  $textColor: string;
}

const LoginButtonStyle = styled.button<LoginButtonStyleProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 28px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  outline: none;
  transition: background-color 0.3s, color 0.3s;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  height: 50px;
  width: 300px;

  background-color: ${(props) => props.$bgColor};
  color: ${(props) => props.$textColor};

  &:hover {
    filter: brightness(0.9);
  }
`;
