import { AccessTokenPayload } from "../types/AccessTokenPayload";

export interface ITokenService {
  generateAccessToken(userId: string, role: string): string;
  verifyAccessToken(token: string): AccessTokenPayload;
}
