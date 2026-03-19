export interface UserInterestProps {
  id?: string;
  userId: string;
  interestId: string;
  createdAt?: Date;
}

export class UserInterest {
  public readonly id: string;
  public readonly userId: string;
  public readonly interestId: string;
  public readonly createdAt: Date;

  constructor(props: UserInterestProps) {
    if (!props.userId) throw new Error("userId is required");
    if (!props.interestId) throw new Error("interestId is required");

    this.id = props.id!;
    this.userId = props.userId;
    this.interestId = props.interestId;
    this.createdAt = props.createdAt ?? new Date();
  }
}
