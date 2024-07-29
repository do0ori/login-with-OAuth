export interface NaverUserInfo {
    resultcode: string;
    message: string;
    response: {
        id: string;
        nickname: string;
        email: string;
        profile_image: string;
    };
}
