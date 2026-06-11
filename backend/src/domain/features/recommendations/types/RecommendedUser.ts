export interface RecommendedUser {
  id: string;
  username: string;
  avatar: string;
  mutualInterestCount: number;
  mutualInterests: string[];
  recommendationScore: number;
  isOnline: boolean;
}
