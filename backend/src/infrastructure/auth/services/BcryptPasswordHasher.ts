import bcrypt from "bcryptjs";
import { IPasswordHasher } from "../../../domain/auth/interfaces/IPasswordHasher";

export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password,hashed);
  }
}
