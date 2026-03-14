import { inject, injectable } from "inversify";
import nodemailer from "nodemailer";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { EmailServiceProvider } from "../../../shared/constants/email-service.const";

@injectable()
export class NodemailerEmailService {
  private _transporter;

  constructor(
    @inject(AUTH_TYPES.EmailUser) private _emailUser: string,
    @inject(AUTH_TYPES.EmailPass) private _emailPass: string,
  ) {
    this._transporter = nodemailer.createTransport({
      service: EmailServiceProvider.GMAIL,
      auth: {
        user: this._emailUser,
        pass: this._emailPass,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });
  }

  async sendVerificationEmail(to: string, link: string): Promise<void> {
    await this._transporter.sendMail({
      from: `"NexaTalk" <${this._emailUser}>`,
      to,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Welcome to NexaTalk 🎉</h2>
          <p>Please verify your email to activate your account.</p>
          <a href="${link}" 
            style="
              background: #3B82F6;
              color: white;
              padding: 10px 15px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
            ">
            Verify Email
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: gray;">
            If you didn’t create this account, ignore this email.
          </p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, link: string): Promise<void> {
    await this._transporter.sendMail({
      from: `NexaTalk <${this._emailUser}>`,
      to: email,
      subject: "Reset your Password",
      html: `
         <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${link}">${link}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });
  }
}
