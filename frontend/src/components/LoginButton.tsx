import React from "react";
import styled from "styled-components";
import { AuthType, GET_CODE_URL } from "../apis/auth.api";
import icGoogle from "../assets/icons/ic-google.svg";
import icKakao from "../assets/icons/ic-kakao.svg";
import icNaver from "../assets/icons/ic-naver.svg";

interface LoginButtonProps {
    provider: AuthType;
    name: string;
}

const Button = styled.button<{ provider: string }>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.25rem;
    width: 70%; // originally 100%
    border-radius: 0.5rem;
    transition: transform 0.1s;
    cursor: pointer;
    background-color: ${({ provider }) =>
        provider === "google"
            ? "#ffffff"
            : provider === "kakao"
            ? "#FEE500"
            : "#03C75A"};
    border: ${({ provider }) =>
        provider === "google" ? "1px solid #dadce0" : "none"};

    &:active {
        transform: scale(0.97);
    }
`;

const Icon = styled.img`
    position: absolute;
    left: 0;
    margin-left: 1.25rem;
`;

const ButtonText = styled.div<{ provider: string }>`
    font-family: "Roboto", sans-serif;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    color: ${({ provider }) => (provider === "naver" ? "#ffffff" : "#000000")};
    opacity: ${({ provider }) => (provider === "kakao" ? "0.85" : "1")};
`;

const LoginButton: React.FC<LoginButtonProps> = ({ provider, name }) => {
    const onClick = () => {
        window.location.href = GET_CODE_URL[provider];
    };

    const getIcon = (provider: string) => {
        switch (provider) {
            case "google":
                return icGoogle;
            case "kakao":
                return icKakao;
            case "naver":
                return icNaver;
            default:
                return "";
        }
    };

    return (
        <Button provider={provider} onClick={onClick}>
            <Icon src={getIcon(provider)} alt={`${provider} icon`} />
            <ButtonText provider={provider}>{name} 로그인</ButtonText>
        </Button>
    );
};

export default LoginButton;
