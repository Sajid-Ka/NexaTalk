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

export interface AvatarUploadResponse {
  avatarUrl: string;
}

// Profile endpoints
export const getMyProfileApi = () => 
  api.get<{ data: ProfileResponse }>("/profiles/me");

export const getProfileByIdApi = (userId: string) => 
  api.get<{ data: ProfileResponse | PublicProfileResponse }>(`/profiles/${userId}`);

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
    
    console.log("Full upload response:", response);
    console.log("Response data:", response.data);
  
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