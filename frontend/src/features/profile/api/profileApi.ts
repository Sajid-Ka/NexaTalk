import { api } from "../../../shared/api/axios";
import type { UserPresence, UserRole } from "../../../shared/constants/user.const";

export interface ProfileResponse {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  status: UserPresence;
  globalRole: UserRole;
  lastSeenAt?: string;
  isProfilePublic: boolean;
  interests?: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProfileResponse {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  status: UserPresence;
  globalRole: UserRole;
  lastSeenAt?: string;
  interests?: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  createdAt: string;
}

export interface UpdateProfileRequest {
  avatar?: string | null;
  bio?: string;
  isProfilePublic?: boolean;
}

export const getMyProfileApi = () => 
  api.get<{ data: ProfileResponse }>("/profiles/me");

export const getProfileByIdApi = (userId: string) => 
  api.get<{ data: ProfileResponse | PublicProfileResponse }>(`/profiles/${userId}`);

export const updateProfileApi = (data: UpdateProfileRequest) => 
  api.patch<{ data: ProfileResponse }>("/profiles/me", data);