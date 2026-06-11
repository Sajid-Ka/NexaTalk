export interface RecommendedServerResponse {
  id: string;
  name: string;
  icon: string | null;
  memberCount: number;
  tag: string;
  matchedInterest: string;
  recommendationScore: number;
}
