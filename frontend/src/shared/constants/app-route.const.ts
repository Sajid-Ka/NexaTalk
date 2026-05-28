export const AppRoute = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  HOME_PAGE: "/home",
  SETTINGS: "/settings",

  VERIFY_EMAIL: "/verify-email",
  CHECK_EMAIL: "/check-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_SERVERS: "/admin/servers",

  ONBOARDING: "/onboarding",

  SERVERS: "/servers",
  SERVER_DASHBOARD: "/servers/:serverId",

  NOT_FOUND: "*",
} as const;

export type AppRoute = (typeof AppRoute)[keyof typeof AppRoute];