export interface UpdateProfileRequest {
  username?: string;
  avatar?: string | null;
  bio?: string;
  isProfilePublic?: boolean;
  showOnlineStatus?: boolean;
}
