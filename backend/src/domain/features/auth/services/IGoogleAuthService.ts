export interface GoogleUserProfile {
  googleId: string;
  email: string;
  name: string;
  picture: string;
  emailVerified: boolean;
}

export interface IGoogleAuthService {
  verifyIdToken(token: string): Promise<GoogleUserProfile>;
}
