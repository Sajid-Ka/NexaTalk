import jwt from "jsonwebtoken";
import { env } from "../../../shared/config/env";

export class JwtTokenService {
  generateAccessToken(userId: string, role: string): string {
    return jwt.sign(
      { sub: userId, role, type: "access" },
      env.JWT_SECRET,
      { expiresIn: "15m" }
    );
  }

  verifyAccessToken(token: string): any {
    const decoded: any = jwt.verify(token, env.JWT_SECRET);
    return {
      userId: decoded.sub,
      role: decoded.role,
    };
  }
}
