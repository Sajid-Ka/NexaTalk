import { Container } from "inversify";
import { AUTH_TYPES } from "./auth.types";

import { UserRepository } from "../../../../infrastructure/features/auth/repositories/UserRepository";
import { RefreshTokenRepository } from "../../../../infrastructure/features/auth/repositories/RefreshTokenRepository";
import { EmailVerificationTokenRepository } from "../../../../infrastructure/features/auth/repositories/EmailVerificationTokenRepository";
import { ResetPasswordTokenRepository } from "../../../../infrastructure/features/auth/repositories/ResetPasswordTokenRepository";

import { Argon2PasswordHasher } from "../../../../infrastructure/features/auth/services/ArgonPasswordHasher";
import { JwtTokenService } from "../../../../infrastructure/features/auth/services/JwtTokenService";
import { SecureTokenGenerator } from "../../../../infrastructure/features/auth/services/SecureTokenGenerator";
import { NodemailerEmailService } from "../../../../infrastructure/features/auth/services/NodemailerEmailService";
import { UserStatusService } from "../../../../infrastructure/features/auth/services/UserStatusService";

import { RegisterUser } from "../../../../application/auth/usecases/RegisterUser";
import { LoginUser } from "../../../../application/auth/usecases/LoginUser";
import { RefreshSession } from "../../../../application/auth/usecases/RefreshSession";
import { LogoutUser } from "../../../../application/auth/usecases/LogoutUser";
import { LogoutAllDevice } from "../../../../application/auth/usecases/LogoutAllDevice";
import { ListUserSessions } from "../../../../application/auth/usecases/ListUserSessions";
import { RevokeSession } from "../../../../application/auth/usecases/RevokeSession";
import { SendVerificationEmail } from "../../../../application/auth/usecases/SendVerificationEmail";
import { RequestVerificationEmail } from "../../../../application/auth/usecases/RequestVerificationEmail";
import { VerifyEmail } from "../../../../application/auth/usecases/VerifyEmail";
import { RequestPasswordReset } from "../../../../application/auth/usecases/RequestPasswordReset";
import { ResetPassword } from "../../../../application/auth/usecases/ResetPassword";

import { AuthController } from "../../../../presentation/auth/controllers/AuthController";
import { SessionController } from "../../../../presentation/auth/controllers/SessionController";

import { env } from "../../../../shared/config/env";
import { CookieSameSite } from "../../../../shared/constants/cookie.const";
import { NodeEnv } from "../../../../shared/constants/environment.const";

export function loadAuthModule(container: Container) {
  container.bind(AUTH_TYPES.UserRepository).to(UserRepository).inSingletonScope();
  container.bind(AUTH_TYPES.RefreshTokenRepository).to(RefreshTokenRepository).inSingletonScope();
  container
    .bind(AUTH_TYPES.EmailVerificationTokenRepository)
    .to(EmailVerificationTokenRepository)
    .inSingletonScope();
  container
    .bind(AUTH_TYPES.ResetPasswordTokenRepository)
    .to(ResetPasswordTokenRepository)
    .inSingletonScope();

  container.bind(AUTH_TYPES.PasswordHasher).to(Argon2PasswordHasher).inSingletonScope();
  container.bind(AUTH_TYPES.TokenService).to(JwtTokenService).inSingletonScope();
  container.bind(AUTH_TYPES.TokenGenerator).to(SecureTokenGenerator).inSingletonScope();
  container.bind(AUTH_TYPES.EmailService).to(NodemailerEmailService).inSingletonScope();
  container.bind(AUTH_TYPES.UserStatusService).to(UserStatusService).inSingletonScope();

  container.bind(AUTH_TYPES.RegisterUser).to(RegisterUser);
  container.bind(AUTH_TYPES.LoginUser).to(LoginUser);
  container.bind(AUTH_TYPES.RefreshSession).to(RefreshSession);
  container.bind(AUTH_TYPES.LogoutUser).to(LogoutUser);
  container.bind(AUTH_TYPES.LogoutAllDevice).to(LogoutAllDevice);
  container.bind(AUTH_TYPES.ListUserSessions).to(ListUserSessions);
  container.bind(AUTH_TYPES.RevokeSession).to(RevokeSession);
  container.bind(AUTH_TYPES.SendVerificationEmail).to(SendVerificationEmail);
  container.bind(AUTH_TYPES.RequestVerificationEmail).to(RequestVerificationEmail);
  container.bind(AUTH_TYPES.VerifyEmail).to(VerifyEmail);
  container.bind(AUTH_TYPES.RequestPasswordReset).to(RequestPasswordReset);
  container.bind(AUTH_TYPES.ResetPassword).to(ResetPassword);

  container.bind(AUTH_TYPES.AuthController).to(AuthController);
  container.bind(AUTH_TYPES.SessionController).to(SessionController);

  container.bind<string>(AUTH_TYPES.JwtSecret).toConstantValue(env.JWT_SECRET);
  container.bind<string>(AUTH_TYPES.JwtAccessTtl).toConstantValue(env.JWT_ACCESS_TTL);

  container.bind<string>(AUTH_TYPES.EmailUser).toConstantValue(env.EMAIL_USER);
  container.bind<string>(AUTH_TYPES.EmailPass).toConstantValue(env.EMAIL_PASS);

  container.bind<string>(AUTH_TYPES.AppBaseUrl).toConstantValue(env.APP_BASE_URL);
  container.bind<string>(AUTH_TYPES.ClientOrigin).toConstantValue(env.CLIENT_ORIGIN);

  container
    .bind<number>(AUTH_TYPES.VerifyEmailTTLMinutes)
    .toConstantValue(env.EMAIL_VERIFY_TTL_MINUTES);
  container
    .bind<number>(AUTH_TYPES.ResetPasswordTTLMinutes)
    .toConstantValue(env.RESET_PASSWORD_TTL_MINUTES);
  container
    .bind<number>(AUTH_TYPES.RefreshTokenTTLDays)
    .toConstantValue(env.REFRESH_TOKEN_TTL_DAYS);
  container.bind(AUTH_TYPES.RefreshCookieOptions).toConstantValue({
    httpOnly: true,
    secure: env.NODE_ENV === NodeEnv.PRODUCTION,
    sameSite: env.NODE_ENV === NodeEnv.PRODUCTION ? CookieSameSite.STRICT : CookieSameSite.LAX,
    path: "/",
    maxAge: env.REFRESH_COOKIE_MAX_AGE_MS,
  });
}
