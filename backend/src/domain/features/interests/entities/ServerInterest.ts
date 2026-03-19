export interface ServerInterestProps {
  id?: string;
  serverId: string;
  interestId: string;
  createdAt?: Date;
}

export class ServerInterest {
  public readonly id: string;
  public readonly serverId: string;
  public readonly interestId: string;
  public readonly createdAt: Date;

  constructor(props: ServerInterestProps) {
    if (!props.serverId) throw new Error("serverId is required");
    if (!props.interestId) throw new Error("interestId is required");

    this.id = props.id!;
    this.serverId = props.serverId;
    this.interestId = props.interestId;
    this.createdAt = props.createdAt ?? new Date();
  }
}
