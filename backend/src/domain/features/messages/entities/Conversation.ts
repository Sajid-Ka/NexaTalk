import { ConversationType } from "../../../../shared/constants/conversation.const";

export interface ConversationProps {
  id?: string;
  type: ConversationType;
  ownerId?: string;
  name?: string;
  avatar?: string;
  participantIds?: string[];
  directKey?: string;
  channelId?: string;
  lastMessageId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Conversation {
  public readonly id: string;
  public readonly type: ConversationType;
  public readonly channelId?: string;

  public readonly ownerId?: string;
  public name?: string;
  public avatar?: string;
  public participantIds: string[];
  public readonly directKey?: string;
  public lastMessageId?: string;

  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: ConversationProps) {
    this.id = props.id!;
    this.type = props.type;
    this.ownerId = props.ownerId;
    this.name = props.name;
    this.avatar = props.avatar;
    this.channelId = props.channelId;
    this.participantIds = props.participantIds ?? [];
    this.directKey = props.directKey;
    this.lastMessageId = props.lastMessageId;

    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
