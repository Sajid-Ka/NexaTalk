import { MongoUserRepository } from "../../infrastructure/auth/repositories/MongoUserRepository";
import { BcryptPasswordHasher } from "../../infrastructure/auth/services/BcryptPasswordHasher";
import { MongoRefreshTokenRepository } from "../../infrastructure/auth/repositories/MongoRefreshTokenRepository";
import { JwtTokenService } from "../../infrastructure/auth/services/JwtTokenService";
import { SecureTokenGenerator } from "../../infrastructure/auth/services/SecureTokenGenerator";
import { RegisterUser } from "../../application/auth/usecases/RegisterUser";
import { LoginUser } from "../../application/auth/usecases/LoginUser";
import { RefreshSession } from "../../application/auth/usecases/RefreshSession";
import { LogoutUser } from "../../application/auth/usecases/LogoutUser";
import { AuthController } from "../../interfaces/auth/controllers/AuthController";
import { SessionController } from "../../interfaces/auth/controllers/SessionController";
import { LogoutAllDevice } from "../../application/auth/usecases/LogoutAllDevice";
import { ListUserSessions } from "../../application/auth/usecases/ListUserSessions";
import { RevokeSession } from "../../application/auth/usecases/RevokeSession";

const userRepo = new MongoUserRepository();
const refreshRepo = new MongoRefreshTokenRepository();
const hasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();
const tokenGenerator = new SecureTokenGenerator();

const registerUser = new RegisterUser(userRepo, hasher);
const loginUser = new LoginUser(userRepo, hasher, tokenService, refreshRepo, tokenGenerator);
const refreshSession = new RefreshSession(refreshRepo, tokenService, tokenGenerator, userRepo);
const logoutUser = new LogoutUser(refreshRepo, tokenGenerator);
const logoutAllDevice = new LogoutAllDevice(refreshRepo);
const listUserSessions = new ListUserSessions(refreshRepo);
const revokeSession = new RevokeSession(refreshRepo);

export const authController = new AuthController(
  registerUser,
  loginUser,
  refreshSession,
);

export const sessionController = new SessionController(
    logoutUser,
    logoutAllDevice,
    listUserSessions,
    revokeSession,
)
