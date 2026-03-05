export const AUTH_TYPES = {
  UserRepository: Symbol.for("Auth.UserRepository"),
  RefreshTokenRepository: Symbol.for("Auth.RefreshTokenRepository"),
  EmailVerificationTokenRepository: Symbol.for("Auth.EmailVerificationTokenRepository"),
  ResetPasswordTokenRepository: Symbol.for("Auth.ResetPasswordTokenRepository"),

  PasswordHasher: Symbol.for("Auth.PasswordHasher"),
  TokenService: Symbol.for("Auth.TokenService"),
  TokenGenerator: Symbol.for("Auth.TokenGenerator"),
  EmailService: Symbol.for("Auth.EmailService"),

  RegisterUser: Symbol.for("Auth.RegisterUser"),
  LoginUser: Symbol.for("Auth.LoginUser"),
  RefreshSession: Symbol.for("Auth.RefreshSession"),
  LogoutUser: Symbol.for("Auth.LogoutUser"),
  LogoutAllDevice: Symbol.for("Auth.LogoutAllDevice"),
  ListUserSessions: Symbol.for("Auth.ListUserSessions"),
  RevokeSession: Symbol.for("Auth.RevokeSession"),
  SendVerificationEmail: Symbol.for("Auth.SendVerificationEmail"),
  VerifyEmail: Symbol.for("Auth.VerifyEmail"),
  RequestPasswordReset: Symbol.for("Auth.RequestPasswordReset"),
  ResetPassword: Symbol.for("Auth.ResetPassword"),

  AuthController: Symbol.for("Auth.AuthController"),
  SessionController: Symbol.for("Auth.SessionController"),

  JwtSecret : Symbol.for("Auth.JwtSecret"),
  JwtAccessTtl : Symbol.for("Auth.JwtAccessTtl"),

  EmailUser : Symbol.for("Auth.EmailUser"),
  EmailPass : Symbol.for("Auth.EmailPass"),
  Logger: Symbol.for("Common.Logger"),
  ClientOrigin: Symbol.for("Auth.ClientOrigin"),
  AppBaseUrl: Symbol.for("Auth.AppBaseUrl"),
  CacheService: Symbol.for("Common.CacheService"),
};