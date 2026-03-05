import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IEmailService } from "../../../domain/auth/services/IEmailService";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { IResetPasswordTokenRepository } from "../../../domain/auth/repositories/IResetPasswordTokenRepository";
import { ResetPasswordToken } from "../../../domain/auth/entities/ResetPasswordToken";
import { IRequestPasswordResetUsecase } from "../interfaces/IRequestPasswordResetUsecase";
import { injectable,inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";


@injectable()
export class RequestPasswordReset implements IRequestPasswordResetUsecase {
    constructor(
        @inject(AUTH_TYPES.UserRepository) private _userRepo : IUserRepository,
        @inject(AUTH_TYPES.TokenGenerator) private _tokenGenerator : ITokenGenerator,
        @inject(AUTH_TYPES.ResetPasswordTokenRepository) private _resetRepo : IResetPasswordTokenRepository,
        @inject(AUTH_TYPES.EmailService) private _emailService : IEmailService,
        @inject(AUTH_TYPES.ClientOrigin) private _frontendUrl : string
    ) {}

    async execute(emal : string) {
        const user =  await this._userRepo.findByEmail(emal);

        if(!user) return;

        const rawToken = this._tokenGenerator.generate();
        const tokenHash = this._tokenGenerator.hash(rawToken);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        await this._resetRepo.save(new ResetPasswordToken({
                userId : user.id,
                tokenHash,
                expiresAt,
            })
        );

        const resetLink = `${this._frontendUrl}/reset-password?token=${rawToken}`;

        await this._emailService.sendPasswordResetEmail(
            user.email,
            resetLink
        );
    }
}