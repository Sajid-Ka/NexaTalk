export const EmailServiceProvider = {
  GMAIL: "gmail",
  OUTLOOK: "outlook",
  SENDGRID: "sendgrid",
} as const;

export type EmailServiceProvider = (typeof EmailServiceProvider)[keyof typeof EmailServiceProvider];
