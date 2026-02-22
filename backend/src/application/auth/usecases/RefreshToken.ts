import { IUserRepository } from "../../../domain/auth/interfaces/IUserRepository";
import { ITokenService } from "../../../domain/auth/interfaces/ITokenService";
import { UnauthorizedError } from "../../../domain/auth/errors/UnauthorizedError";
import { env } from "../../../shared/config/env";

export class RefreshToken {
    constructor(
        private userRepo: IUserRepository,
        private tokenService: ITokenService
    ) { }

    async execute(token: string): Promise<{ accessToken: string }> {
        const payload = this.tokenService.verifyToken(token, env.JWT_REFRESH_SECRET);

        if (!payload || !payload.userId) {
            throw new UnauthorizedError("Invalid refresh token");
        }

        const user = await this.userRepo.findById(payload.userId);

        if (!user || user.isBlocked) {
            throw new UnauthorizedError("User not found or blocked");
        }

        const newAccessToken = this.tokenService.generateAccessToken(user.id, user.globalRole);

        return { accessToken: newAccessToken };
    }
}
