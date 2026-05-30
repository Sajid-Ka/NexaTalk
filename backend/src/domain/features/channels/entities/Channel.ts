import { ChannelType } from "../../../../shared/constants/channel.const";

export interface ChannelProps {
  id?: string;
  serverId: string;
  name: string;
  type: ChannelType;
  createdBy: string;
  position?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Channel {
  public readonly id: string;
  public readonly serverId: string;
  public readonly name: string;
  public readonly type: ChannelType;
  public readonly createdBy: string;
  public readonly position: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ChannelProps) {
    if (!props.serverId) throw new Error("Server ID is required");
    if (!props.createdBy) throw new Error("Creator ID is required");
    if (!props.name || props.name.trim().length < 1) {
      throw new Error("Channel name is required");
    }

    this.id = props.id!;
    this.serverId = props.serverId;
    this.name = props.name.trim();
    this.type = props.type;
    this.createdBy = props.createdBy;
    this.position = props.position ?? 0;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
