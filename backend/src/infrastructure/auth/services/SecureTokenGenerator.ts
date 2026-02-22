import crypto from "crypto";

export class SecureTokenGenerator {
  generate(): string {
    return crypto.randomBytes(64).toString("hex");
  }

  hash(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
