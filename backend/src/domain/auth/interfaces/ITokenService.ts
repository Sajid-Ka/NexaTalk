export interface ITokenService {
  generateAccessToken(userId: string, role: string): string;
  verifyAccessToken(token: string): any;
}
