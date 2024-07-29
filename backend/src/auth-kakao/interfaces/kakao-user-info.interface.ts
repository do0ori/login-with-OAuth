export interface KakaoUserInfo {
    id: number;
    properties: {
        nickname: string;
        profile_image: string;
    };
    kakao_account: {
        email: string;
    };
}
