export interface ConversationParticipantProps {
  id?: string;
  conversationId: string;
  userId: string;
  lastReadMessageId?: string;
  joinedAt?: Date;
}

export class ConversationParticipant {
  public readonly id: string;
  public readonly conversationId: string;
  public readonly userId: string;
  public lastReadMessageId?: string;
  public readonly joinedAt: Date;

  constructor(props: ConversationParticipantProps) {
    this.id = props.id!;
    this.conversationId = props.conversationId;
    this.userId = props.userId;
    this.lastReadMessageId = props.lastReadMessageId;
    this.joinedAt = props.joinedAt ?? new Date();
  }
}
