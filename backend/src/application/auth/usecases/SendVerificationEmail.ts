import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IEmailVerificationTokenRepository } from "../../../domain/auth/repositories/IEmailVerificationTokenRepository";
import { IEmailService } from "../../../domain/auth/services/IEmailService";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { EmailVerificationToken } from "../../../domain/auth/entities/EmailVerificationToken";
import { ISendVerificationEmailUsecase } from "../interfaces/ISendVerificationEmailUsecase";

const  VERIFY_TTL_MINUTES = 60;

export class SendVerificationEmail implements ISendVerificationEmailUsecase {
    constructor(
        private userRepo : IUserRepository,
        private tokenRepo : IEmailVerificationTokenRepository,
        private tokenGenerator : ITokenGenerator,
        private emailService : IEmailService,
        private appBaseUrl : string
    ) {}

    async execute(userId: string): Promise<void> {
        const user = await this.userRepo.findById(userId);
        if(!user) return;

        if(user.isEmailVerified) return;

        await this.tokenRepo.deleteAllByUser(user.id);

        const rawToken = this.tokenGenerator.generate();
        const tokenHash = this.tokenGenerator.hash(rawToken);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + VERIFY_TTL_MINUTES);

        const token = new EmailVerificationToken({
            userId : user.id,
            tokenHash,
            expiresAt,
        });

        await this.tokenRepo.save(token); 

        const verificationLink =`${this.appBaseUrl}/verify-email?token=${rawToken}`;

        await this.emailService.sendVerificationEmail(
            user.email,
            verificationLink
        )

    }
}