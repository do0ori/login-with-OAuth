import React, { useEffect, useState } from "react";
import { Header } from "./Index";
import { UserInfo, requestLogout, requestUserInfo } from "../apis/auth.api";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import Google from "../assets/icons/ic-provider-google.svg";
import Kakao from "../assets/icons/ic-provider-kakao.svg";
import Naver from "../assets/icons/ic-provider-naver.svg";

const MyPage: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const navigate = useNavigate();

    const ProviderIcon = (provider: string) => {
        switch (provider) {
            case "kakao":
                return Kakao;
            case "google":
                return Google;
            case "naver":
                return Naver;
            default:
                return "";
        }
    };

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
                <FaUser color="black" />내 정보
            </MyHeader>
            {userInfo && (
                <div>
                    <ProfileImage
                        src={userInfo.profileImageUrl}
                        alt="프로필 이미지"
                    />
                    <Wrapper>
                        <UserName>{userInfo.name}님</UserName>
                        <UserBadge
                            src={ProviderIcon(userInfo.provider)}
                            alt={`${userInfo.provider} badge`}
                        />
                    </Wrapper>
                    <p>{userInfo.email}</p>
                </div>
            )}
            <LogoutButton
                onClick={() => {
                    requestLogout().then(() => {
                        navigate("/");
                    });
                }}
            >
                로그아웃
            </LogoutButton>
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

const LogoutButton = styled.button`
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
    width: 200px;

    background-color: gray;
    color: white;

    &:hover {
        filter: brightness(0.9);
    }
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const UserName = styled.p`
    margin: 0;
`;

const UserBadge = styled.img`
    margin-left: 8px;
`;

export default MyPage;
