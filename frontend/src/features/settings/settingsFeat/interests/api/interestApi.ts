import { api } from "../../../../../shared/api/axios";

export interface AddInterestsRequest {
  interests: string[];
}

export interface RemoveInterestsRequest {
  interestIds: string[];
}

export const addInterestsApi = (data: AddInterestsRequest) =>
  api.post("/interests/me", data);

export const removeInterestsApi = (data: RemoveInterestsRequest) =>
  api.delete("/interests/me", { data });

export interface InterestResponse {
  id: string;
  name: string;
  category: string;
}

export const getMyInterestsApi = () =>
  api.get<{ data: InterestResponse[] }>("/interests/me");
