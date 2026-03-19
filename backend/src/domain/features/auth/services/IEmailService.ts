export interface IEmailService {
  sendVerificationEmail(email: string, verificationLink: string): Promise<void>;
  sendPasswordResetEmail(email: string, verificationLink: string): Promise<void>;
}
