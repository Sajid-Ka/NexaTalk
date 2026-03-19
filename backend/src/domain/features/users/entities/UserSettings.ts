export interface UserSettingsProps {
  id?: string;
  userId: string;
  showRecommendations: boolean;
  allowFriendRecommendations: boolean;
  allowServerRecommendations: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}

export class UserSettings {
  public readonly id: string;
  public readonly userId: string;
  public readonly showRecommendations: boolean;
  public readonly allowFriendRecommendations: boolean;
  public readonly allowServerRecommendations: boolean;
  public readonly updatedAt: Date;
  public readonly createdAt: Date;

  constructor(props: UserSettingsProps) {
    this.id = props.id!;
    this.userId = props.userId;
    this.showRecommendations = props.showRecommendations ?? true;
    this.allowFriendRecommendations = props.allowFriendRecommendations ?? true;
    this.allowServerRecommendations = props.allowServerRecommendations ?? true;
    this.updatedAt = props.updatedAt ?? new Date();
    this.createdAt = props.createdAt ?? new Date();
  }
}
