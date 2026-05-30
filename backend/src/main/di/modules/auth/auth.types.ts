export const AUTH_TYPES = {
  UserRepository: Symbol.for("UserRepository"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),
  EmailVerificationTokenRepository: Symbol.for("EmailVerificationTokenRepository"),
  ResetPasswordTokenRepository: Symbol.for("ResetPasswordTokenRepository"),

  PasswordHasher: Symbol.for("PasswordHasher"),
  TokenService: Symbol.for("TokenService"),
  TokenGenerator: Symbol.for("TokenGenerator"),
  EmailService: Symbol.for("EmailService"),
  UserStatusService: Symbol.for("UserStatusService"),

  RegisterUser: Symbol.for("RegisterUser"),
  LoginUser: Symbol.for("LoginUser"),
  RefreshSession: Symbol.for("RefreshSession"),
  LogoutUser: Symbol.for("LogoutUser"),
  LogoutAllDevice: Symbol.for("LogoutAllDevice"),
  ListUserSessions: Symbol.for("ListUserSessions"),
  RevokeSession: Symbol.for("RevokeSession"),
  SendVerificationEmail: Symbol.for("SendVerificationEmail"),
  RequestVerificationEmail: Symbol.for("RequestVerificationEmail"),
  VerifyEmail: Symbol.for("VerifyEmail"),
  RequestPasswordReset: Symbol.for("RequestPasswordReset"),
  ResetPassword: Symbol.for("ResetPassword"),

  AuthController: Symbol.for("AuthController"),
  SessionController: Symbol.for("SessionController"),

  JwtSecret: Symbol.for("JwtSecret"),
  JwtAccessTtl: Symbol.for("JwtAccessTtl"),

  EmailUser: Symbol.for("EmailUser"),
  EmailPass: Symbol.for("EmailPass"),
  ClientOrigin: Symbol.for("ClientOrigin"),
  AppBaseUrl: Symbol.for("AppBaseUrl"),

  VerifyEmailTTLMinutes: Symbol.for("VerifyEmailTTLMinutes"),
  ResetPasswordTTLMinutes: Symbol.for("ResetPasswordTTLMinutes"),
  RefreshTokenTTLDays: Symbol.for("RefreshTokenTTLDays"),
  RefreshCookieOptions: Symbol.for("RefreshCookieOptions"),
};
