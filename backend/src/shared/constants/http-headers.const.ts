export const HttpHeader = {
  AUTHORIZATION: "authorization",
  USER_AGENT: "user-agent",
  CONTENT_TYPE: "content-type",
  ACCEPT: "accept",
} as const;

export type HttpHeader = (typeof HttpHeader)[keyof typeof HttpHeader];
