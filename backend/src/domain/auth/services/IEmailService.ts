export interface IEmailService {
    sendVerificationEmail(email : string, verificationLink : string) : Promise<void>;
}