export const HttpHeader = {
  AUTHORIZATION: "Authorization",
  BEARER: "Bearer",
} as const;

export type HttpHeader =
  (typeof HttpHeader)[keyof typeof HttpHeader];


export const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export type HttpMethod =
  (typeof HttpMethod)[keyof typeof HttpMethod];


export const HttpStatus = {
  UNAUTHORIZED: 401,
} as const;

export type HttpStatus =
  (typeof HttpStatus)[keyof typeof HttpStatus];