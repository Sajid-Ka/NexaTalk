import { IVerifyEmailUsecase } from "../interfaces/IVerifyEmailUsecase";
import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IEmailVerificationTokenRepository } from "../../../domain/auth/repositories/IEmailVerificationTokenRepository";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ICacheService } from "../../../domain/common/service/ICacheService";

@injectable()
export class VerifyEmail implements IVerifyEmailUsecase {
    constructor (
        @inject(AUTH_TYPES.UserRepository) private _userRepo : IUserRepository,
        @inject(AUTH_TYPES.EmailVerificationTokenRepository) private _tokenRepo : IEmailVerificationTokenRepository,
        @inject(AUTH_TYPES.TokenGenerator) private _tokenGenerator : ITokenGenerator,
        @inject(AUTH_TYPES.CacheService) private _cache : ICacheService
    ) {}

    async execute(rawToken: string): Promise<void> {
        const tokenHash = this._tokenGenerator.hash(rawToken);

        const cacheKey = `verify_email:${tokenHash}`

        const exists = await this._cache.exists(cacheKey);
        if(!exists) throw new Error("Invalid or expired Verification token");

        const token = await this._tokenRepo.findByHash(tokenHash);
        if(!token) throw new Error("Invalid or expired verification token");

        if(token.used){ 
            await this._cache.delete(cacheKey);
            throw new Error("Verification token alredy used");
        }

        if(token.isExpired()) throw new Error("Verification token expired");

        const user = await this._userRepo.findById(token.userId);
        if(!user) throw new Error("User not found");

        if(user.isEmailVerified){
            await this._tokenRepo.markAsUsed(token.id!);
            return
        }

        await this._userRepo.update(user.id, { isEmailVerified : true, })

        await this._tokenRepo.markAsUsed(token.id!);

        await this._tokenRepo.deleteAllByUser(user.id);

        await this._cache.delete(cacheKey);
    }
}