import { api } from "../../../../../shared/api/axios";
import type { UserPresence, UserRole } from "../../../../../shared/constants/user.const";
import { UserRelationship } from "../../../../../shared/constants/relationship.const";

export interface ProfileResponse {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  status: UserPresence;
  globalRole: UserRole;
  showOnlineStatus: boolean;
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
  showOnlineStatus?: boolean;
  lastSeenAt?: string;
  interests?: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  createdAt: string;
}

export interface UserPreviewResponse {
  user: ProfileResponse | PublicProfileResponse;
  relationship: UserRelationship;
}

export interface UpdateProfileRequest {
  username?: string;
  avatar?: string | null;
  bio?: string;
  isProfilePublic?: boolean;
  showOnlineStatus?: boolean;
}

export interface AvatarUploadResponse {
  avatarUrl: string;
}

export interface UserSearchResult {
  id: string;
  username: string;
  avatar?: string;
  status: UserPresence;
  isFriend?: boolean;
  friendRequestSent?: boolean;
}

export interface SearchUserResponse {
  id: string;
  username: string;
  avatar?: string;
  status: UserPresence;
}

// Profile endpoints
export const getMyProfileApi = () =>
  api.get<{ data: ProfileResponse }>("/profiles/me");

export const getProfileByIdApi = (userId: string) =>
  api.get<{ data: ProfileResponse | PublicProfileResponse }>(`/profiles/${userId}`);

export const getUserPreviewApi = (userId: string) =>
  api.get<{ data: UserPreviewResponse }>(`/profiles/${userId}/preview`);

export const updateProfileApi = (data: UpdateProfileRequest) =>
  api.patch<{ data: ProfileResponse }>("/profiles/me", data);

// Avatar endpoints - FIXED with proper response handling
export const uploadAvatarApi = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await api.post("/profiles/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const avatarUrl = response.data?.data?.avatarUrl;

    if (!avatarUrl) {
      console.error("Avatar URL not found in response:", response.data);
      throw new Error("Invalid response from server");
    }

    return avatarUrl;
  } catch (error) {
    console.error("Upload API error:", error);
    throw error;
  }
};

export const deleteAvatarApi = () =>
  api.delete("/profiles/me/avatar");

export const searchUsersApi = (query: string, limit: number = 10) =>
  api.get<{ data: UserSearchResult[] }>("/profiles/search", {
    params: { q: query, limit }
  });