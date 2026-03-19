import { injectable } from "inversify";
import argon2 from "argon2";
import { IPasswordHasher } from "../../../../domain/features/auth/services/IPasswordHasher";

@injectable()
export class Argon2PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return argon2.verify(hashed, password);
  }
}
