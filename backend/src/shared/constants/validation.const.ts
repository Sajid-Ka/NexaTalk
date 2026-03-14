export const ValidationSource = {
  BODY: "body",
  QUERY: "query",
} as const;

export type ValidationSource = (typeof ValidationSource)[keyof typeof ValidationSource];
