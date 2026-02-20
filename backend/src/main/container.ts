import { MongoUserRepository } from "../infrastructure/auth/repositories/MongoUserRepository";
import { BcryptPasswordHasher } from "../infrastructure/auth/services/BcryptPasswordHasher";
import { RegisterUser } from "../application/auth/usecases/RegisterUser";
import { AuthController } from "../interfaces/auth/controllers/AuthController";

const userRepo = new MongoUserRepository();
const hasher = new BcryptPasswordHasher();

const registerUser = new RegisterUser(userRepo,hasher);

export const authController = new AuthController(registerUser);