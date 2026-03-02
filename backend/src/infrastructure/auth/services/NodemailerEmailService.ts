import nodemailer from "nodemailer";

export class NodemailerEmailService {
  private transporter;

  constructor(
    private emailUser: string,
    private emailPass: string
  ) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.emailUser,
        pass: this.emailPass,
      },
      connectionTimeout : 5000,
      greetingTimeout : 5000,
      socketTimeout : 5000,
    });
  }

  async sendVerificationEmail(to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"NexaTalk" <${this.emailUser}>`,
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
}