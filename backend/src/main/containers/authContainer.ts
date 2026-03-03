import { env } from "../../shared/config/env";
import { UserRepository } from "../../infrastructure/auth/repositories/UserRepository";
import { RefreshTokenRepository } from "../../infrastructure/auth/repositories/RefreshTokenRepository";
import { BcryptPasswordHasher } from "../../infrastructure/auth/services/BcryptPasswordHasher";
import { JwtTokenService } from "../../infrastructure/auth/services/JwtTokenService";
import { SecureTokenGenerator } from "../../infrastructure/auth/services/SecureTokenGenerator";
import { RegisterUser } from "../../application/auth/usecases/RegisterUser";
import { LoginUser } from "../../application/auth/usecases/LoginUser";
import { RefreshSession } from "../../application/auth/usecases/RefreshSession";
import { LogoutUser } from "../../application/auth/usecases/LogoutUser";
import { LogoutAllDevice } from "../../application/auth/usecases/LogoutAllDevice";
import { ListUserSessions } from "../../application/auth/usecases/ListUserSessions";
import { RevokeSession } from "../../application/auth/usecases/RevokeSession";
import { AuthController } from "../../presentation/auth/controllers/AuthController";
import { SessionController } from "../../presentation/auth/controllers/SessionController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { logger } from "../../infrastructure/common/logger/WinstonLogger";
import { EmailVerificationTokenRepository } from "../../infrastructure/auth/repositories/EmailVerificationTokenRepository";
import { SendVerificationEmail } from "../../application/auth/usecases/SendVerificationEmail";
import { VerifyEmail } from "../../application/auth/usecases/VerifyEmail";
import { NodemailerEmailService } from "../../infrastructure/auth/services/NodemailerEmailService";
import { ResetPasswordTokenRepository } from "../../infrastructure/auth/repositories/ResetPasswordTokenRepository";
import { RequestPasswordReset } from "../../application/auth/usecases/RequestPasswordReset";
import { ResetPassword } from "../../application/auth/usecases/ResetPassword";

const userRepo = new UserRepository();
const refreshRepo = new RefreshTokenRepository();
const hasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService(env.JWT_SECRET, "15m");
const tokenGenerator = new SecureTokenGenerator();

const emailTokenRepo = new EmailVerificationTokenRepository();
const emailService = new NodemailerEmailService(env.EMAIL_USER,env.EMAIL_PASS);
const sendVerificationEmail = new SendVerificationEmail(userRepo,emailTokenRepo,tokenGenerator,emailService,env.APP_BASE_URL);
const verifyEmail = new VerifyEmail(userRepo,emailTokenRepo,tokenGenerator);

const registerUser = new RegisterUser(userRepo, hasher,sendVerificationEmail);
const loginUser = new LoginUser(userRepo, hasher, tokenService, refreshRepo, tokenGenerator);
const refreshSession = new RefreshSession(refreshRepo, tokenService, tokenGenerator, userRepo, logger);
const logoutUser = new LogoutUser(refreshRepo, tokenGenerator);
const logoutAllDevice = new LogoutAllDevice(refreshRepo);
const listUserSessions = new ListUserSessions(refreshRepo);
const revokeSession = new RevokeSession(refreshRepo);

const resetTokenRepo = new ResetPasswordTokenRepository();

const requestPasswordReset = new RequestPasswordReset(userRepo,tokenGenerator,resetTokenRepo,emailService,env.APP_BASE_URL);
const resetPassword = new ResetPassword(resetTokenRepo,userRepo,tokenGenerator,hasher);

const authMiddleware = createAuthMiddleware(tokenService);

export const authController = new AuthController(
  registerUser,
  loginUser,
  refreshSession,
  verifyEmail,
  requestPasswordReset,
  resetPassword
);

export const sessionController = new SessionController(
  logoutUser,
  logoutAllDevice,
  listUserSessions,
  revokeSession,
)


export { authMiddleware };
