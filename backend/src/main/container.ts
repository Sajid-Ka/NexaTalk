import { MongoUserRepository } from "../infrastructure/auth/repositories/MongoUserRepository";
import { BcryptPasswordHasher } from "../infrastructure/auth/services/BcryptPasswordHasher";
import { MongoRefreshTokenRepository } from "../infrastructure/auth/repositories/MongoRefreshTokenRepository";
import { JwtTokenService } from "../infrastructure/auth/services/JwtTokenService";
import { SecureTokenGenerator } from "../infrastructure/auth/services/SecureTokenGenerator";
import { RegisterUser } from "../application/auth/usecases/RegisterUser";
import { LoginUser } from "../application/auth/usecases/LoginUser";
import { RefreshSession } from "../application/auth/usecases/RefreshSession";
import { LogoutUser } from "../application/auth/usecases/LogoutUser";
import { AuthController } from "../interfaces/auth/controllers/AuthController";

const userRepo = new MongoUserRepository();
const refreshRepo = new MongoRefreshTokenRepository();
const hasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();
const tokenGenerator = new SecureTokenGenerator();

const registerUser = new RegisterUser(userRepo, hasher);
const loginUser = new LoginUser(userRepo, hasher, tokenService, refreshRepo, tokenGenerator);
const refreshSession = new RefreshSession(refreshRepo, tokenService, tokenGenerator, userRepo);
const logoutUser = new LogoutUser(refreshRepo, tokenGenerator);

export const authController = new AuthController(
    registerUser,
    loginUser,
    refreshSession,
    logoutUser
);
