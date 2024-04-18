import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import styled from "styled-components";
import { useEffect } from "react";
import { AUTH_TYPE_LIST, AuthType, requestLogin } from "../apis/auth.api";

const AuthCallbackPage: React.FC = () => {
  // const { authType } = useParams<{ authType: AuthType }>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");

    const login = async () => {
      try {
        // if (!authType || !AUTH_TYPE_LIST.includes(authType) || !code) {
        //   throw new Error("Invalid authType or code");
        // }
        if (!code) throw new Error("Invalid authType or code");

        await requestLogin("kakao", code);
        navigate("/me");
      } catch (error) {
        console.error("로그인 요청 오류:", error);
        navigate("/");
      }
    };

    login();
  }, [location.search, navigate]);

  return (
    <AuthPageStyle>
      <LoadingSpinner size={50} color="gray" />
    </AuthPageStyle>
  );
};

const AuthPageStyle = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default AuthCallbackPage;
