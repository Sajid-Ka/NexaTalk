import { AccessTokenPayload } from "../types/AccessTokenPayload";

export interface ITokenService {
  generateAccessToken(userId: string, role: string, sessionVersion: number): string;
  verifyAccessToken(token: string): Promise<AccessTokenPayload>;
  revokeUserTokens?(userId: string): Promise<void>;
}
