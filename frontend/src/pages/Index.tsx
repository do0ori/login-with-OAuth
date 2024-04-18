import { styled } from "styled-components";
import {
  GoogleLoginButton,
  KakaoLoginButton,
  NaverLoginButton,
} from "../components/LoginButton";

const Index: React.FC = () => {
  return (
    <div className="App">
      <Header>시작하기</Header>
      <LoginContainer className="login-options">
        <KakaoLoginButton />
        <NaverLoginButton />
        <GoogleLoginButton />
      </LoginContainer>
    </div>
  );
};

export const Header = styled.header`
  font-size: 2rem;
  margin: 50px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

export default Index;
