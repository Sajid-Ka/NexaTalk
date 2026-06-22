import { InterestResponse } from "./InterestResponse";

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
