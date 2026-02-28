import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ITokenService } from "../../../domain/auth/services/ITokenService";
import { AccessTokenPayload } from "../../../domain/auth/types/AccessTokenPayload";

export class JwtTokenService implements ITokenService {
  constructor(
    private readonly secret: string,
    private readonly accessTtl: SignOptions["expiresIn"],
  ) { }

  generateAccessToken(userId: string, role: string): string {
    return jwt.sign(
      { sub: userId, role, type: "access" },
      this.secret,
      { expiresIn: this.accessTtl }
    );
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    const decoded = jwt.verify(token, this.secret) as JwtPayload & {
      sub: string;
      role: string;
    };
    return {
      userId: decoded.sub,
      role: decoded.role,
    };
  }
}
