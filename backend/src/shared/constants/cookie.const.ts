export const CookieSameSite = {
  LAX: "lax",
  STRICT: "strict",
  NONE: "none",
} as const;

export type CookieSameSite = (typeof CookieSameSite)[keyof typeof CookieSameSite];

export const CookieName = {
  REFRESH_TOKEN: "refreshTokenV2",
  SESSION_ID: "sessionId",
  CSRF_TOKEN: "csrfToken",
} as const;

export type CookieName = (typeof CookieName)[keyof typeof CookieName];
