import { IVerifyEmailUsecase } from "../interfaces/IVerifyEmailUsecase";
import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IEmailVerificationTokenRepository } from "../../../domain/auth/repositories/IEmailVerificationTokenRepository";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";

@injectable()
export class VerifyEmail implements IVerifyEmailUsecase {
    constructor (
        @inject(AUTH_TYPES.UserRepository) private _userRepo : IUserRepository,
        @inject(AUTH_TYPES.EmailVerificationTokenRepository) private _tokenRepo : IEmailVerificationTokenRepository,
        @inject(AUTH_TYPES.TokenGenerator) private _tokenGenerator : ITokenGenerator,
    ) {}

    async execute(rawToken: string): Promise<void> {
        const tokenHash = this._tokenGenerator.hash(rawToken);

        const token = await this._tokenRepo.findByHash(tokenHash);
        if(!token) throw new Error("Invalid or expired verification token");

        if(token.used) throw new Error("Vrification token alredy used");

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
    }
}