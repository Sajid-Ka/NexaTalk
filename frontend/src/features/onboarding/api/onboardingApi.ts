import { api } from "../../../shared/api/axios";
import type { InterestResponse, OnboardingRequest, OnboardingResponse } from "../types/onboarding.types"

export const getPopularInterestsApi = (limit: number = 20) => 
  api.get<{ data: InterestResponse[] }>(`/interests/popular?limit=${limit}`);

export const completeOnboardingApi = (data: OnboardingRequest) => 
  api.post<{ data: OnboardingResponse }>("/onboarding/complete", data);