export const RecommendationType = {
  PEOPLE: "people",
  SERVERS: "servers",
  BOTH: "both",
} as const;

export type RecommendationType = (typeof RecommendationType)[keyof typeof RecommendationType];
