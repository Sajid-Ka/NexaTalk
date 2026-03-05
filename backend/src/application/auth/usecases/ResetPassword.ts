import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/auth/services/IPasswordHasher";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { IResetPasswordTokenRepository } from "../../../domain/auth/repositories/IResetPasswordTokenRepository";
import { IResetPasswordUsecase } from "../interfaces/IResetPasswordUsecase";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ICacheService } from "../../../domain/common/service/ICacheService";

@injectable()
export class ResetPassword implements IResetPasswordUsecase {
    constructor(
        @inject(AUTH_TYPES.ResetPasswordTokenRepository) private _resetRepo : IResetPasswordTokenRepository,
        @inject(AUTH_TYPES.UserRepository) private _userRepo : IUserRepository,
        @inject(AUTH_TYPES.TokenGenerator) private _tokenGenerator : ITokenGenerator,
        @inject(AUTH_TYPES.PasswordHasher) private _hasher : IPasswordHasher,
        @inject(AUTH_TYPES.CacheService) private _cache : ICacheService
    ) {}

    async execute(token : string, newPassword : string){
        const tokenHash = this._tokenGenerator.hash(token);

        const cacheKey = `reset_password:${tokenHash}`;

        const exists = await this._cache.exists(cacheKey);
        if(!exists) throw new Error("Invalid or expired reset token");

        const storedToken = await this._resetRepo.findByTokenHash(tokenHash);
        if(!storedToken) throw new Error("Invalid reset token");

        if(storedToken.used) {
            await this._cache.delete(cacheKey);
            throw new Error("Token already used");
        }
        if(storedToken.isExpired()) throw new Error("Token Expired");

        const user = await this._userRepo.findById(storedToken.userId);
        if(!user) throw new Error("User not found");

        const hashedPassword = await this._hasher.hash(newPassword);
        
        await this._userRepo.update(user.id, {
            passwordHash : hashedPassword,
        });

        await this._resetRepo.markAsUsed(storedToken.id!);

        await this._cache.delete(cacheKey);

        await this._resetRepo.deleteByUserId(user.id);
    }
}