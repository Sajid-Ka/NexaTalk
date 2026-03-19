export interface Interest {
  id: string;
  name: string;
  category: string;
  createdAt: string;
}

export interface InterestResponse {
  id: string;
  name: string;
  category: string;
  createdAt: string;
}

export interface OnboardingRequest {
  interests?: string[];
}

export interface OnboardingResponse {
  success: boolean;
  completedAt: string;
  interestsAdded: number;
  skipped: boolean;
}