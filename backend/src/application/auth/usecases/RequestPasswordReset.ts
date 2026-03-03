import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IEmailService } from "../../../domain/auth/services/IEmailService";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { IResetPasswordTokenRepository } from "../../../domain/auth/repositories/IResetPasswordTokenRepository";
import { ResetPasswordToken } from "../../../domain/auth/entities/ResetPasswordToken";
import { IRequestPasswordResetUsecase } from "../interfaces/IRequestPasswordResetUsecase";

export class RequestPasswordReset implements IRequestPasswordResetUsecase {
    constructor(
        private userRepo : IUserRepository,
        private tokenGenerator : ITokenGenerator,
        private resetRepo : IResetPasswordTokenRepository,
        private emailService : IEmailService,
        private frontendUrl : string
    ) {}

    async execute(emal : string) {
        const user =  await this.userRepo.findByEmail(emal);

        if(!user) return;

        const rawToken = this.tokenGenerator.generate();
        const tokenHash = this.tokenGenerator.hash(rawToken);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        await this.resetRepo.save(new ResetPasswordToken({
                userId : user.id,
                tokenHash,
                expiresAt,
            })
        );

        const resetLink = `${this.frontendUrl}/reset-password?token=${rawToken}`;

        await this.emailService.sendPasswordResetEmail(
            user.email,
            resetLink
        );
    }
}