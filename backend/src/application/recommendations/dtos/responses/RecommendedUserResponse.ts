export interface RecommendedUserResponse {
  id: string;
  username: string;
  avatar: string;
  mutualInterestCount: number;
  mutualInterests: string[];
  recommendationScore: number;
  isOnline: boolean;
}
