export const RecommendationType = {
  PEOPLE: "people",
  SERVERS: "servers",
  BOTH: "both",
} as const;

export type RecommendationType = (typeof RecommendationType)[keyof typeof RecommendationType];

export const RecommendationMatching = {
  MIN_MATCHING_INTERESTS: 1,
  MIN_SERVER_MEMBERS: 1,
};

export type RecommendationMatching =
  (typeof RecommendationMatching)[keyof typeof RecommendationMatching];
