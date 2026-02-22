import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../../../shared/config/env";
import { AccessTokenPayload } from "../../../domain/auth/types/AccessTokenPayload";

export class JwtTokenService {
  generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ sub: userId, role, type: "access" }, env.JWT_SECRET, { expiresIn: "15m" });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload & {
      sub: string;
      role: string;
    };
    return {
      userId: decoded.sub,
      role: decoded.role,
    };
  }
}
