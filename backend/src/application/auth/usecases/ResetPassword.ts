import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/auth/services/IPasswordHasher";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { IResetPasswordTokenRepository } from "../../../domain/auth/repositories/IResetPasswordTokenRepository";
import { IResetPasswordUsecase } from "../interfaces/IResetPasswordUsecase";

export class ResetPassword implements IResetPasswordUsecase {
    constructor(
        private resetRepo : IResetPasswordTokenRepository,
        private userRepo : IUserRepository,
        private tokenGenerator : ITokenGenerator,
        private hasher : IPasswordHasher
    ) {}

    async execute(token : string, newPassword : string){
        const tokenHash = this.tokenGenerator.hash(token);

        const storedToken = await this.resetRepo.findByTokenHash(tokenHash);
        if(!storedToken) throw new Error("Invalid token");

        if(storedToken.used) throw new Error("Token alredy used");
        if(storedToken.isExpired()) throw new Error("Token Expired");

        const user = await this.userRepo.findById(storedToken.userId);
        if(!user) throw new Error("User not found");

        const hashedPassword = await this.hasher.hash(newPassword);
        
        await this.userRepo.update(user.id, {
            passwordHash : hashedPassword,
        });

        await this.resetRepo.deleteByUserId(user.id);
    }
}