import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IEmailVerificationTokenRepository } from "../../../domain/auth/repositories/IEmailVerificationTokenRepository";
import { IEmailService } from "../../../domain/auth/services/IEmailService";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { EmailVerificationToken } from "../../../domain/auth/entities/EmailVerificationToken";
import { ISendVerificationEmailUsecase } from "../interfaces/ISendVerificationEmailUsecase";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ICacheService } from "../../../domain/common/service/ICacheService";

const  VERIFY_TTL_MINUTES = 15;
const VERIFY_TTL_SECONDS = 60 * 15;

@injectable()
export class SendVerificationEmail implements ISendVerificationEmailUsecase {
    constructor(
        @inject(AUTH_TYPES.UserRepository) private _userRepo : IUserRepository,
        @inject(AUTH_TYPES.EmailVerificationTokenRepository) private _tokenRepo : IEmailVerificationTokenRepository,
        @inject(AUTH_TYPES.TokenGenerator) private _tokenGenerator : ITokenGenerator,
        @inject(AUTH_TYPES.EmailService) private _emailService : IEmailService,
        @inject(AUTH_TYPES.CacheService) private _cache : ICacheService,
        @inject(AUTH_TYPES.AppBaseUrl) private _appBaseUrl : string
    ) {}

    async execute(userId: string): Promise<void> {
        const user = await this._userRepo.findById(userId);
        if(!user) return;

        if(user.isEmailVerified) return;

        await this._tokenRepo.deleteAllByUser(user.id);

        const rawToken = this._tokenGenerator.generate();
        const tokenHash = this._tokenGenerator.hash(rawToken);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + VERIFY_TTL_MINUTES);

        const token = new EmailVerificationToken({
            userId : user.id,
            tokenHash,
            expiresAt,
        });

        await this._tokenRepo.save(token); 

        const cacheKey = `verify_email:${tokenHash}`;

        await this._cache.set(
            cacheKey,
            {userId : user.id},
            VERIFY_TTL_SECONDS
        )

        const verificationLink =`${this._appBaseUrl}/verify-email?token=${rawToken}`;

        await this._emailService.sendVerificationEmail(
            user.email,
            verificationLink
        )

    }
}