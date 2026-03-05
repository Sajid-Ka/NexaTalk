import { Container } from "inversify";
import { AUTH_TYPES } from "./auth.types";

import { UserRepository } from "../../../../infrastructure/auth/repositories/UserRepository";
import { RefreshTokenRepository } from "../../../../infrastructure/auth/repositories/RefreshTokenRepository";
import { EmailVerificationTokenRepository } from "../../../../infrastructure/auth/repositories/EmailVerificationTokenRepository";
import { ResetPasswordTokenRepository } from "../../../../infrastructure/auth/repositories/ResetPasswordTokenRepository";

import { Argon2PasswordHasher } from "../../../../infrastructure/auth/services/ArgonPasswordHasher";
import { JwtTokenService } from "../../../../infrastructure/auth/services/JwtTokenService";
import { SecureTokenGenerator } from "../../../../infrastructure/auth/services/SecureTokenGenerator";
import { NodemailerEmailService } from "../../../../infrastructure/auth/services/NodemailerEmailService";

import { RegisterUser } from "../../../../application/auth/usecases/RegisterUser";
import { LoginUser } from "../../../../application/auth/usecases/LoginUser";
import { RefreshSession } from "../../../../application/auth/usecases/RefreshSession";
import { LogoutUser } from "../../../../application/auth/usecases/LogoutUser";
import { LogoutAllDevice } from "../../../../application/auth/usecases/LogoutAllDevice";
import { ListUserSessions } from "../../../../application/auth/usecases/ListUserSessions";
import { RevokeSession } from "../../../../application/auth/usecases/RevokeSession";
import { SendVerificationEmail } from "../../../../application/auth/usecases/SendVerificationEmail";
import { VerifyEmail } from "../../../../application/auth/usecases/VerifyEmail";
import { RequestPasswordReset } from "../../../../application/auth/usecases/RequestPasswordReset";
import { ResetPassword } from "../../../../application/auth/usecases/ResetPassword";

import { AuthController } from "../../../../presentation/auth/controllers/AuthController";
import { SessionController } from "../../../../presentation/auth/controllers/SessionController";
import { logger } from "../../../../infrastructure/common/logger/logger";

import { env } from "../../../../shared/config/env";

import { RedisCacheService } from "../../../../infrastructure/common/cache/RedisCacheService";

export function loadAuthModule(container: Container) {

  container.bind(AUTH_TYPES.Logger).toConstantValue(logger);
  container.bind(AUTH_TYPES.UserRepository).to(UserRepository).inSingletonScope();
  container.bind(AUTH_TYPES.RefreshTokenRepository).to(RefreshTokenRepository).inSingletonScope();
  container.bind(AUTH_TYPES.EmailVerificationTokenRepository).to(EmailVerificationTokenRepository).inSingletonScope();
  container.bind(AUTH_TYPES.ResetPasswordTokenRepository).to(ResetPasswordTokenRepository).inSingletonScope();

  container.bind(AUTH_TYPES.PasswordHasher).to(Argon2PasswordHasher).inSingletonScope();
  container.bind(AUTH_TYPES.TokenService).to(JwtTokenService).inSingletonScope();
  container.bind(AUTH_TYPES.TokenGenerator).to(SecureTokenGenerator).inSingletonScope();
  container.bind(AUTH_TYPES.EmailService).to(NodemailerEmailService).inSingletonScope();

  container.bind(AUTH_TYPES.RegisterUser).to(RegisterUser);
  container.bind(AUTH_TYPES.LoginUser).to(LoginUser);
  container.bind(AUTH_TYPES.RefreshSession).to(RefreshSession);
  container.bind(AUTH_TYPES.LogoutUser).to(LogoutUser);
  container.bind(AUTH_TYPES.LogoutAllDevice).to(LogoutAllDevice);
  container.bind(AUTH_TYPES.ListUserSessions).to(ListUserSessions);
  container.bind(AUTH_TYPES.RevokeSession).to(RevokeSession);
  container.bind(AUTH_TYPES.SendVerificationEmail).to(SendVerificationEmail);
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

  container.bind(AUTH_TYPES.CacheService).to(RedisCacheService).inSingletonScope();
}