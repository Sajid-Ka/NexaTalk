import { IVerifyEmailUsecase } from "../interfaces/IVerifyEmailUsecase";
import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IEmailVerificationTokenRepository } from "../../../domain/auth/repositories/IEmailVerificationTokenRepository";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";

export class VerifyEmail implements IVerifyEmailUsecase {
    constructor (
        private userRepo : IUserRepository,
        private tokenRepo : IEmailVerificationTokenRepository,
        private tokenGenerator : ITokenGenerator,
    ) {}

    async execute(rawToken: string): Promise<void> {
        const tokenHash = this.tokenGenerator.hash(rawToken);

        const token = await this.tokenRepo.findByHash(tokenHash);
        if(!token) throw new Error("Invalid or expired verification token");

        if(token.used) throw new Error("Vrification token alredy used");

        if(token.isExpired()) throw new Error("Verification token expired");

        const user = await this.userRepo.findById(token.userId);
        if(!user) throw new Error("User not found");

        if(user.isEmailVerified){
            await this.tokenRepo.markAsUsed(token.id!);
            return
        }

        await this.userRepo.update(user.id, { isEmailVerified : true, })

        await this.tokenRepo.markAsUsed(token.id!);

        await this.tokenRepo.deleteAllByUser(user.id);
    }
}