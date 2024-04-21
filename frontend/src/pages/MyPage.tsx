import React, { useEffect, useState } from "react";
import { Header } from "./Index";
import { UserInfo, requestUserInfo } from "../apis/auth.api";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";

const MyPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    requestUserInfo()
      .then((response) => {
        setUserInfo(response);
      })
      .catch((error) => {
        console.error("사용자 정보 요청 오류:", error);
        navigate("/");
      });
  }, []);

  return (
    <div className="App">
      <MyHeader>
        <Link to={"/"}>
          <IoMdHome color="black" />
        </Link>
        내 정보
      </MyHeader>
      {userInfo && (
        <div>
          <ProfileImage src={userInfo.profile_image_url} alt="프로필 이미지" />
          <p>이름: {userInfo.name}</p>
          <p>이메일: {userInfo.email}</p>
        </div>
      )}
    </div>
  );
};

const MyHeader = styled(Header)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 15px;
`;

export default MyPage;
