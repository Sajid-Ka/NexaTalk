import crypto from "crypto";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { injectable } from "inversify";
import { Encoding, HashAlgorithm } from "../../../shared/constants/crypto.const";

@injectable()
export class SecureTokenGenerator implements ITokenGenerator {
  generate(): string {
    return crypto.randomBytes(64).toString(Encoding.HEX);
  }

  hash(token: string): string {
    return crypto.createHash(HashAlgorithm.SHA256).update(token).digest(Encoding.HEX);
  }
}
