import crypto from "crypto";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { injectable } from "inversify";

@injectable()
export class SecureTokenGenerator implements ITokenGenerator {
  generate(): string {
    return crypto.randomBytes(64).toString("hex");
  }

  hash(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
