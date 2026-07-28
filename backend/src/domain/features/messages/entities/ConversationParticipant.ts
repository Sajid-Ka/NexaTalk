import { GroupRole } from "../../../../shared/constants/group-role.const";

export interface ConversationParticipantProps {
  id?: string;
  conversationId: string;
  userId: string;
  role?: GroupRole;
  lastReadMessageId?: string;
  joinedAt?: Date;
}

export class ConversationParticipant {
  public readonly id: string;
  public readonly conversationId: string;
  public readonly userId: string;
  public role: GroupRole;
  public lastReadMessageId?: string;
  public readonly joinedAt: Date;

  constructor(props: ConversationParticipantProps) {
    this.id = props.id!;
    this.conversationId = props.conversationId;
    this.userId = props.userId;
    this.role = props.role ?? GroupRole.MEMBER;
    this.lastReadMessageId = props.lastReadMessageId;
    this.joinedAt = props.joinedAt ?? new Date();
  }
}
