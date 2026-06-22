import { InterestResponse } from "./InterestResponse";

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
