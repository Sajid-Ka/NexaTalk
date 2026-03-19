export interface InterestResponse {
  id: string;
  name: string;
  category: string;
  createdAt: Date;
}

export interface UserWithInterestsResponse {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: string;
  interests: InterestResponse[];
  matchScore?: number;
  matchedInterests?: string[];
}

export interface ServerWithInterestsResponse {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  memberCount: number;
  interests: InterestResponse[];
  matchScore?: number;
  matchedInterests?: string[];
}
