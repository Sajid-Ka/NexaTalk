export interface RecommendationProps {
  id?: string;
  userId: string;
  recommendedUserIds?: string[];
  recommendedServerIds?: string[];
  lastRefreshedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Recommendation {
  public readonly id: string;
  public readonly userId: string;
  public readonly recommendedUserIds: string[];
  public readonly recommendedServerIds: string[];
  public readonly lastRefreshedAt: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: RecommendationProps) {
    if (!props.userId) throw new Error("userId is required");

    this.id = props.id!;
    this.userId = props.userId;
    this.recommendedUserIds = props.recommendedUserIds || [];
    this.recommendedServerIds = props.recommendedServerIds || [];
    this.lastRefreshedAt = props.lastRefreshedAt;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public isStale(ttlMinutes: number = 60): boolean {
    const now = new Date();
    const diffMinutes = (now.getTime() - this.lastRefreshedAt.getTime()) / (1000 * 60);
    return diffMinutes > ttlMinutes;
  }
}
