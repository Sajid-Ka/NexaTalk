import crypto from "crypto";

export class ServerInviteUtil {
  static generateCode(): string {
    return crypto.randomBytes(8).toString("hex");
  }

  static generateInviteUrl(code: string, baseUrl: string): string {
    return `${baseUrl}/invite/${code}`;
  }

  static calculateExpiryDate(days: number = 7): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
}