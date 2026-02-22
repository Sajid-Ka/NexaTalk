export interface UserLoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        username: string;
        email: string;
        globalRole: string;
    };
}
