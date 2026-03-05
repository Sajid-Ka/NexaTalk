import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ITokenService } from "../../../domain/auth/services/ITokenService";
import { AccessTokenPayload } from "../../../domain/auth/types/AccessTokenPayload";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";

@injectable()
export class JwtTokenService implements ITokenService {
  constructor(
    @inject(AUTH_TYPES.JwtSecret) private readonly _secret: string,
    @inject(AUTH_TYPES.JwtAccessTtl) private readonly _accessTtl: SignOptions["expiresIn"],
  ) { }

  generateAccessToken(userId: string, role: string): string {
    return jwt.sign(
      { sub: userId, role, type: "access" },
      this._secret,
      { expiresIn: this._accessTtl }
    );
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    const decoded = jwt.verify(token, this._secret) as JwtPayload & {
      sub: string;
      role: string;
    };
    return {
      userId: decoded.sub,
      role: decoded.role,
    };
  }
}
