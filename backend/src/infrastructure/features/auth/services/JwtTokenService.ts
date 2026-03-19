import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ITokenService } from "../../../../domain/features/auth/services/ITokenService";
import { AccessTokenPayload } from "../../../../domain/features/auth/types/AccessTokenPayload";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { GlobalRole } from "../../../../shared/constants/userRole.const";
import { TokenType } from "../../../../shared/constants/token-type.const";
import { RedisCacheService } from "../../../core/common/cache/RedisCacheService";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { UnauthorizedError } from "../../../../domain/core/errors/UnauthorizedError";

@injectable()
export class JwtTokenService implements ITokenService {
  constructor(
    @inject(AUTH_TYPES.JwtSecret) private readonly _secret: string,
    @inject(AUTH_TYPES.JwtAccessTtl) private readonly _accessTtl: SignOptions["expiresIn"],
    @inject(COMMON_TYPES.CacheService) private readonly _cacheService: RedisCacheService,
  ) {}

  generateAccessToken(userId: string, role: GlobalRole, sessionVersion: number): string {
    return jwt.sign({ sub: userId, role, sessionVersion, type: TokenType.ACCESS }, this._secret, {
      expiresIn: this._accessTtl,
    });
  }

  async revokeUserTokens(userId: string): Promise<void> {
    await this._cacheService.set(`blacklist:user:${userId}`, true, 86400); // 24 hours
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      const decoded = jwt.verify(token, this._secret) as JwtPayload & {
        sub: string;
        role: GlobalRole;
        sessionVersion: number;
      };

      return {
        userId: decoded.sub,
        role: decoded.role,
        sessionVersion: decoded.sessionVersion,
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid token");
      }
      throw error;
    }
  }
}
