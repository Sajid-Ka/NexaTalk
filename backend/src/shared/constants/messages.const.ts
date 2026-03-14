export const AuthMessage = {
  USER_REGISTERED: "User registered successfully",
  EMAIL_VERIFIED: "Email verified successfully",
  LOGIN_SUCCESS: "Login successful",
  TOKEN_REFRESHED: "Token refreshed",
  PASSWORD_RESET_LINK_SENT: "If the email exists, reset link has been sent",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
} as const;

export const SessionMessage = {
  LOGGED_OUT: "Logged out",
  LOGGED_OUT_SUCCESS: "Logged out successfully",
  LOGGED_OUT_ALL: "Logged out from all devices",
  SESSIONS_FETCHED: "Active sessions fetched",
  SESSION_REVOKED: "Session revoked successfully",
} as const;

export const HealthMessage = {
  OK: "ok",
  HEALTH_CHECK_SUCCESS: "Health check successful",
} as const;

export const ErrorMessage = {
  UNAUTHORIZED: "Unauthorized",
  TOKEN_MISSING: "Token missing",
  REFRESH_TOKEN_MISSING: "refresh token missing",
  UNAUTHORIZED_ACCESS: "Unauthorized access",
  INSUFFICIENT_PERMISSIONS: "Insufficient Permissions",
  USER_NOT_FOUND: "User found",
  INTERNAL_SERVER_ERROR: "Internal server error",
} as const;
